import SwiftUI

/// Die Startansicht der Hütten App.
///
/// Diese View zeigt zunächst einen einfachen Begrüßungstext. Du kannst sie
/// später erweitern, um z. B. einen Überblick über die aktuellen
/// Urlaubsinformationen anzuzeigen oder Navigationsoptionen zu weiteren
/// Seiten hinzuzufügen.
struct ContentView: View {
    var body: some View {
        VStack {
            Text("Willkommen zur Hütten App!")
                .font(.title)
                .padding()
            Text("Dies ist der Startpunkt für die Entwicklung.")
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
    }
}

/// Vorschau für die Xcode‑Canvas.
struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}