# Frontend für das Session-Verwaltungs-Projekt (Hochschule)

Dieses Verzeichnis enthält den Quellcode für das Frontend der Webanwendung, die im Rahmen meines Hochschulprojekts zur Session-Verwaltung entwickelt wird. Das Frontend dient als Benutzeroberfläche, über die Interaktionen stattfinden, die den Zustand der Benutzer-Sessions beeinflussen und die durch die Backend-Logik (unter Verwendung von Memcached und Oracle 23ai) verwaltet werden.

## Technologie-Stack

Dieses Frontend wurde mit den folgenden Technologien und Bibliotheken entwickelt:

* **[Framework: Vue.js]:** Ein progressives JavaScript-Framework für die Entwicklung benutzerzentrierter Single-Page-Anwendungen (SPAs).
* **[State Management Library: Pinia]:** Für die zentrale Verwaltung des Anwendungszustands, insbesondere im Hinblick auf Benutzer-Session-Informationen und Authentifizierungsstatus.
* **[Routing Library: Vue Router)]:** Für die Navigation zwischen verschiedenen Ansichten und Seiten innerhalb der Anwendung.
* **[Build Tool, z.B. Vite oder Webpack (standardmäßig bei Vue CLI)]:** Für das Bündeln, Optimieren und Bereitstellen der Frontend-Assets.
* **[Paketmanager: npm]:** Zum Verwalten der Projektabhängigkeiten.
* **[Axios für HTTP-Anfragen]:**

## Funktionalitäten 

Dieses Frontend ermöglicht Nutzern:

* **[Login-Funktionalität]:** Sich mit ihren Anmeldedaten zu authentifizieren und eine neue Session zu starten.
* **[Logout-Funktionalität]:** Die aktuelle Session zu beenden und sich abzumelden.
* **[Anzeigen des Session-Status (optional)]:** Informationen über die aktuelle Session einzusehen (z.B. Benutzername, Ablaufzeit).
* **[Interaktion mit geschützten Bereichen (falls zutreffend)]:** Zugriff auf Bereiche der Anwendung, die eine aktive und gültige Session erfordern.
* **[Verwaltung von benutzerbezogenen Daten (falls zutreffend)]:** Anzeigen und Bearbeiten von Daten, die an die aktuelle Session gebunden sind.
* **[Fehlerbehandlung bei Session-bezogenen Operationen]:** Anzeigen von informativen Fehlermeldungen bei Problemen mit der Session-Verwaltung (z.B. ungültige Anmeldedaten, abgelaufene Session).
* **[Responsives Design (falls zutreffend)]:** Eine Benutzeroberfläche, die sich an verschiedene Bildschirmgrößen anpasst.
