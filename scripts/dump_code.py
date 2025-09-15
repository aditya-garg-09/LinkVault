import os

SOURCE_EXTENSIONS = {".py", ".js", ".ts", ".java", ".cpp", ".c", ".cs", ".html", ".css", ".json", ".md"}
OUTPUT_FILE = "project_dump.txt"

def collect_source_files(root_dir):
    all_files = []
    for dirpath, _, filenames in os.walk(root_dir):
        # Skip heavy/unwanted folders
        if any(skip in dirpath for skip in ["node_modules", ".git", "venv", "__pycache__"]):
            continue
        for file in filenames:
            if any(file.endswith(ext) for ext in SOURCE_EXTENSIONS):
                all_files.append(os.path.join(dirpath, file))
    return all_files

def save_contents(files, output_file):
    with open(output_file, "w", encoding="utf-8") as out:
        for file_path in files:
            print(f"📂 Reading {file_path}")
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()
                out.write(f"\n\n--- FILE: {file_path} ---\n\n")
                out.write(content)
            except Exception as e:
                out.write(f"\n\n--- FILE: {file_path} (Error reading: {e}) ---\n\n")

if __name__ == "__main__":
    print("🚀 Script started")
    root = os.getcwd()
    print(f"📌 Scanning directory: {root}")
    files = collect_source_files(root)
    print(f"✅ Found {len(files)} source files")
    save_contents(files, OUTPUT_FILE)
    print(f"🎉 Saved project dump to {OUTPUT_FILE}")
