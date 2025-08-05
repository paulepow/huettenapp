import SwiftUI

/// Der Einstiegspunkt der Hütten App.
///
/// In dieser Datei wird das `@main`‑struct deklariert, das beim Start der App
/// ausgeführt wird. Es erstellt ein `WindowGroup`, das die `ContentView`
/// als Hauptansicht lädt. Passe den Namen `HuettenAppApp` bei Bedarf an dein
/// Projekt in Xcode an.
@main
struct HuettenAppApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}