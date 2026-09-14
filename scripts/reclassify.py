"""Rewrite docs/*.md frontmatter to the 8-category scheme."""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "docs"

PROTOCOL_TAGS = {
    "OSPF": "OSPF",
    "RIP": "RIP",
    "ACL": "ACL",
    "ISIS": "ISIS",
    "IGP协议": "IGP",
    "EGP协议": "EGP",
    "LLDP": "LLDP",
    "CSMA CD": "CSMA/CD",
    "CSMA_CD": "CSMA/CD",
    "二进制指数退避算法": "CSMA/CD",
    "静态路由": "静态路由",
    "子网划分": "子网划分",
    "校园网": "校园网",
    "路由器": "设备",
    "交换机": "设备",
    "Netmiko库": "Netmiko",
    "NetDevOps": "NetDevOps",
}

TROUBLE_TAGS = {
    "git push失败": ["Git"],
    "无法将项目更改push到远程仓库": ["Git"],
    "WSL2无法安装": ["WSL"],
    "WSL无法使用apt安装的问题": ["WSL"],
    "mysql服务无法启动": ["MySQL"],
    "远程ssh云服务器无法登录": ["SSH"],
    "使用百度统计时发生的错误": ["百度统计"],
    "steam-致命错误": ["Steam"],
    "电脑性能卡顿和虚拟内存设置": ["Cursor"],
    "使用constexpt会报错": ["C和C++"],
    "在服务器上装宝塔问题": ["宝塔"],
}

OVERRIDES: dict[str, tuple[str, list[str]]] = {
    "ai/README.md": ("AI", []),
    "about_bot/本地部署LLM实现识图功能.md": ("AI", ["AstrBot", "Ollama"]),
    "knowledge-base/knowledge/Python/AI编程.md": ("AI", ["Python", "RAG"]),
    "knowledge-base/knowledge/agent/codex报错.md": ("AI", ["Codex", "Agent"]),
    "knowledge-base/knowledge/Python/链表.md": ("算法", ["Python", "C和C++", "指针"]),
    "knowledge-base/knowledge/C和C++/git.md": ("随笔", ["Git"]),
    "knowledge-base/knowledge/C和C++/在Linux上进行c++开发.md": ("C和C++", ["Linux"]),
    "knowledge-base/knowledge/专业术语/GIL（全局解释器锁）.md": ("Python", ["GIL"]),
    "knowledge-base/knowledge/专业术语/LLDP.md": ("计算机网络", ["LLDP"]),
    "knowledge-base/knowledge/专业术语/广播风暴.md": ("计算机网络", ["广播风暴"]),
    "knowledge-base/knowledge/专业术语/上下文切换.md": ("Linux", ["上下文切换"]),
    "start.md": ("随笔", []),
    "杂谈/关于上传到自己的远程仓库.md": ("随笔", ["Git"]),
    "knowledge-base/knowledge/study_feel/关于上传到自己的远程仓库.md": ("随笔", ["Git"]),
    "knowledge-base/knowledge/study_feel/如何写健壮的脚本？.md": ("随笔", []),
}


def parse_frontmatter(text: str) -> tuple[dict, str] | None:
    if not text.startswith("---"):
        return None
    parts = text.split("---", 2)
    if len(parts) < 3:
        return None
    raw, body = parts[1], parts[2]
    data: dict = {}
    key = None
    list_acc: list[str] | None = None
    for line in raw.splitlines():
        if not line.strip():
            continue
        if list_acc is not None and line.startswith("  - "):
            list_acc.append(line[4:].strip().strip("'\""))
            continue
        if list_acc is not None:
            data[key] = list_acc
            list_acc = None
            key = None
        if ":" not in line:
            continue
        k, v = line.split(":", 1)
        k, v = k.strip(), v.strip()
        if k in {"category", "tag", "tags"} and v == "":
            key = k
            list_acc = []
            continue
        if k == "tags" and v.startswith("["):
            inner = v.strip("[]")
            data["tags"] = [x.strip().strip("'\"") for x in inner.split(",") if x.strip()]
            continue
        data[k] = v.strip("\"'") if v else ""
    if list_acc is not None and key:
        data[key] = list_acc
    return data, body


def dump_frontmatter(data: dict, body: str) -> str:
    order = [
        "title",
        "date",
        "category",
        "tag",
        "article",
        "layout",
        "home",
        "heroText",
        "tagline",
        "heroAlt",
        "heroImage",
        "heroImageStyle",
        "bgImage",
        "bgImageDark",
        "bgImageStyle",
        "heroFullScreen",
        "copyright",
        "footer",
        "created",
    ]
    lines = ["---"]
    seen = set()

    def emit(k: str, v) -> None:
        if k in seen or v is None or v == "" or v == []:
            return
        seen.add(k)
        if isinstance(v, list):
            lines.append(f"{k}:")
            for item in v:
                lines.append(f"  - {item}")
        else:
            lines.append(f"{k}: {v}")

    for k in order:
        if k in data:
            emit(k, data[k])
    for k, v in data.items():
        emit(k, v)
    lines.append("---")
    if body.startswith("\n"):
        return "\n".join(lines) + body
    return "\n".join(lines) + "\n" + body


def existing_tags(data: dict) -> list[str]:
    out: list[str] = []
    for key in ("tag", "tags"):
        val = data.get(key)
        if isinstance(val, list):
            out.extend(val)
        elif isinstance(val, str) and val:
            out.append(val)
    return out


DROP_TAGS = {
    "知识库",
    "C和C++",
    "Python",
    "计算机网络",
    "Linux",
    "Leetcode",
    "数据结构与算法",
    "遇到的一些问题",
    "关于物理设备",
    "专业术语",
    "study_feel",
    "agent",
    "网络技术",
    "eNSP实验",
    "AstrBot",
    "随笔",
    "AI",
    "算法",
    "踩坑",
    "CPP",
    "数据结构",
}


def classify(rel: str, stem: str, parts: list[str]) -> tuple[str, list[str]] | None:
    if rel in OVERRIDES:
        return OVERRIDES[rel]
    if rel == "knowledge-base/README.md":
        return ("", [])
    if rel == "README.md":
        return None

    extra: list[str] = []
    posix = rel.replace("\\", "/")

    if posix.startswith("ai/") or posix.startswith("about_bot/"):
        return "AI", extra
    if "knowledge/agent/" in posix:
        return "AI", ["Agent"]
    if "knowledge/Leetcode/" in posix:
        return "算法", ["Leetcode"]
    if "knowledge/数据结构与算法/" in posix:
        return "算法", extra
    if "knowledge/遇到的一些问题/" in posix:
        extra.extend(TROUBLE_TAGS.get(stem, []))
        return "踩坑", extra
    if "knowledge/study_feel/" in posix:
        return "随笔", extra
    if "knowledge/Linux/" in posix:
        return "Linux", extra
    if "knowledge/C和C++/" in posix:
        return "C和C++", extra
    if "knowledge/Python/" in posix:
        if stem in PROTOCOL_TAGS:
            extra.append(PROTOCOL_TAGS[stem])
        return "Python", extra
    if "knowledge/计算机网络/" in posix:
        if "基础知识" in parts:
            extra.append("基础知识")
        if "局域网" in parts:
            extra.append("局域网")
        if "网络安全" in parts:
            extra.append("网络安全")
        if "面试" in parts:
            extra.append("面试")
        if stem in PROTOCOL_TAGS:
            extra.append(PROTOCOL_TAGS[stem])
        return "计算机网络", extra
    if "knowledge/关于物理设备/" in posix:
        extra.append("设备")
        if stem in PROTOCOL_TAGS:
            extra.append(PROTOCOL_TAGS[stem])
        return "计算机网络", extra
    if posix.startswith("Network/"):
        if "基础知识" in parts:
            extra.append("基础知识")
        if "eNSP" in parts or stem == "安装eNSP":
            extra.append("eNSP")
        if stem in PROTOCOL_TAGS:
            extra.append(PROTOCOL_TAGS[stem])
        return "计算机网络", extra
    if posix.startswith("eNSP实验/"):
        return "计算机网络", ["eNSP"]
    if posix.startswith("杂谈/"):
        return "随笔", extra
    raise SystemExit(f"unmapped: {rel}")


def uniq(items: list[str]) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for item in items:
        if not item or item in seen:
            continue
        seen.add(item)
        out.append(item)
    return out


def main() -> None:
    changed = 0
    for path in sorted(ROOT.rglob("*.md")):
        if ".vuepress" in path.parts:
            continue
        rel = path.relative_to(ROOT).as_posix()
        text = path.read_text(encoding="utf-8")
        parsed = parse_frontmatter(text)
        if parsed is None:
            print(f"skip no fm: {rel}")
            continue
        data, body = parsed
        result = classify(rel, path.stem, list(path.parts))
        if result is None:
            print(f"skip homepage: {rel}")
            continue
        category, extra = result
        kept = [t for t in existing_tags(data) if t not in DROP_TAGS]
        tags = uniq(extra + kept)

        data.pop("tags", None)
        if category:
            data["category"] = [category]
        else:
            data.pop("category", None)
        if tags:
            data["tag"] = tags
        else:
            data.pop("tag", None)

        new = dump_frontmatter(data, body)
        if new != text:
            path.write_text(new, encoding="utf-8", newline="\n")
            changed += 1
            print(f"{rel} -> {category or '(none)'} {tags}")
    print(f"updated {changed} files")


if __name__ == "__main__":
    main()
