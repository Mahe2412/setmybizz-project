import json, re

log_path = r'C:\Users\mahen\.gemini\antigravity\brain\3eb76c1c-e94e-40b3-b225-53a7f237473e\.system_generated\logs\overview.txt'
with open(log_path, 'r', encoding='utf-8') as f:
    data = f.read()

tool_calls = re.findall(r'call:default_api:(multi_replace_file_content|replace_file_content|write_to_file)\{([^}]+)\}', data)

for idx, (func, args_str) in enumerate(tool_calls):
    try:
        # Simple extraction without full json parsing since regex could be messy
        if '"TargetFile":' in args_str:
            if 'HomeTab.tsx' in args_str or 'QuickChatFloating.tsx' in args_str or 'ArklePanel.tsx' in args_str or 'page.tsx' in args_str:
                print(f"Match [{idx}]: {func} ")
                with open(f'{idx}_extracted.txt', 'w', encoding='utf-8') as out:
                    out.write(args_str)
    except Exception as e:
        pass
