// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::{
    Manager, RunEvent,
};

fn main() {
    // This should be called as early in the execution of the app as possible
    #[cfg(debug_assertions)] // only enable instrumentation in development builds
    let devtools = tauri_plugin_devtools::init();

    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_clipboard::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_sql::Builder::new().build())
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                window.hide().unwrap();
                api.prevent_close();
            }
        });

    #[cfg(debug_assertions)]
    {
        builder = builder
            .plugin(devtools)
            .plugin(tauri_plugin_clipboard::init());
    }

    builder
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|app_handle, event| {
            // We use a match statement here to filter the specific event we want:
            match event {
                // This variant is only relevant on macOS:
                RunEvent::Reopen {
                    has_visible_windows,
                    ..
                } => {
                    if !has_visible_windows {
                        if let Some(window) = app_handle.get_webview_window("main") {
                            window.show().unwrap();
                            window.set_focus().unwrap();
                        }
                    }
                }

                _ => {}
            }
        });
}

//
// -------------------------------------
// TRAY REFRESH FUNCTION
// -------------------------------------
//
// fn refresh_tray(app: &tauri::AppHandle) {
//     let clipboard = app.state::<tauri_plugin_clipboard::Clipboard>();
//     let is_monitoring = clipboard.is_monitor_running();

//     let new_label = if is_monitoring {
//         "Stop Monitoring"
//     } else {
//         "Start Monitoring"
//     };

//     println!("{}", new_label);
//     let new_tooltip = if is_monitoring {
//         "Clipify is monitoring"
//     } else {
//         "Clipify is not monitoring"
//     };

//     println!("{}", new_tooltip);
// }

// .setup(|app| Ok(()))

//  let handle = app.handle();

//             let clipboard = handle.state::<tauri_plugin_clipboard::Clipboard>();
//             let is_monitoring = clipboard.is_monitor_running();

//             //
//             // ---------- DYNAMIC MENU SETUP ----------
//             //
//             let monitor_label = "Start Monitoring";

//             let icon_quit = Image::from_bytes(include_bytes!("../icons/icon.png")).unwrap();
//             let icon_play = Image::from_bytes(include_bytes!("../icons/play.png")).unwrap();
//             let icon_pause = Image::from_bytes(include_bytes!("../icons/pause.png")).unwrap();

//             let monitor_item =
//                 MenuItem::with_id(app, "toggle_monitor", monitor_label, true, None::<&str>)?;

//             let quit_item = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;

//             let menu = Menu::with_items(app, &[&monitor_item, &quit_item])?;

//             let tooltip = if is_monitoring {
//                 "Clipify is monitoring"
//             } else {
//                 "Clipify is not monitoring"
//             };

//             let _ = TrayIconBuilder::new()
//                 .icon(app.default_window_icon().unwrap().clone())
//                 .tooltip(tooltip)
//                 .menu(&menu)
//                 .show_menu_on_left_click(true)
//                 .on_menu_event(move |app, event| match event.id.as_ref() {
//                     "quit" => {
//                         println!("Quit clicked");
//                         app.exit(0);
//                     }

//                     "toggle_monitor" => {
//                         let clipboard = app.state::<tauri_plugin_clipboard::Clipboard>();
//                         let currently_monitoring = clipboard.is_monitor_running();
//                         if currently_monitoring {
//                             let _ = clipboard.stop_monitor(app.clone());
//                             println!("Monitoring stopped: {}", clipboard.is_monitor_running());
//                             let _ = monitor_item.set_text("Start Monitoring");
//                         } else {
//                             let _ = clipboard.start_monitor(app.clone());
//                             println!("Monitoring started: {}", clipboard.is_monitor_running());
//                             let _ = monitor_item.set_text("Stop Monitoring");
//                         }

//                         // 🔄 Refresh tooltip + menu items
//                         refresh_tray(app);
//                     }

//                     _ => {}
//                 })
//                 .build(app)?;
