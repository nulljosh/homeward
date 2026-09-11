import SwiftUI
import Supabase

/// Mirrors `app/login` and `app/register` on the web: email+password, Supabase handles session
/// persistence. Toolbar entry point, shown as a sheet.
struct AuthBar: View {
    @State private var session: Session?
    @State private var showingSheet = false

    var body: some View {
        Group {
            if let email = session?.user.email {
                Menu(email) {
                    Button("Log out", role: .destructive) {
                        Task { try? await supabase.auth.signOut() }
                    }
                }
                .font(.caption)
            } else {
                Button("Log in") { showingSheet = true }
                    .font(.caption)
            }
        }
        .task {
            session = try? await supabase.auth.session
            for await (_, newSession) in supabase.auth.authStateChanges {
                session = newSession
            }
        }
        .sheet(isPresented: $showingSheet) { AuthSheet() }
    }
}

private struct AuthSheet: View {
    @Environment(\.dismiss) private var dismiss

    @State private var email = ""
    @State private var password = ""
    @State private var isRegister = false
    @State private var error: String?
    @State private var submitting = false

    var body: some View {
        NavigationStack {
            Form {
                TextField("Email", text: $email)
                    .textContentType(.emailAddress)
                    .keyboardType(.emailAddress)
                    .textInputAutocapitalization(.never)
                SecureField("Password", text: $password)
                    .textContentType(isRegister ? .newPassword : .password)
                if let error { Text(error).foregroundStyle(.red).font(.caption) }
                Button(isRegister ? "Have an account? Log in" : "Need an account? Register") {
                    isRegister.toggle()
                    error = nil
                }
                .font(.caption)
            }
            .navigationTitle(isRegister ? "Register" : "Log in")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) { Button("Cancel") { dismiss() } }
                ToolbarItem(placement: .confirmationAction) {
                    Button(submitting ? "..." : (isRegister ? "Register" : "Log in")) { Task { await submit() } }
                        .disabled(submitting || email.isEmpty || password.isEmpty)
                }
            }
        }
    }

    private func submit() async {
        submitting = true
        error = nil
        do {
            if isRegister {
                try await supabase.auth.signUp(email: email, password: password)
            } else {
                try await supabase.auth.signIn(email: email, password: password)
            }
            dismiss()
        } catch {
            self.error = error.localizedDescription
        }
        submitting = false
    }
}
