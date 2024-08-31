use notify::{RecommendedWatcher, Watcher, RecursiveMode, Config, Event};
use std::sync::mpsc::channel;
use std::path::Path;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Create a channel to receive the events.
    let (tx, rx) = channel();

    // Automatically select the best implementation for your platform.
    let mut watcher = RecommendedWatcher::new(tx, Config::default())?;

    // Watch the specified path for changes.
    watcher.watch(Path::new("user"), RecursiveMode::NonRecursive)?;

    println!("Watching for changes...");

    loop {
        match rx.recv() {
            Ok(Ok(event)) => handle_event(event),
            Ok(Err(e)) => println!("watch error: {:?}", e),
            Err(e) => println!("channel error: {:?}", e),
        }
    }
}

fn handle_event(event: Event) {
    // Check for file modification events (for example purposes)
    for path in event.paths {
        if let Some(filename) = path.file_name() {
            println!("detectado {:?}", event.kind);
        }
    }
}
