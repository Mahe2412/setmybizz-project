"""
Patch script:
1. Insert ServiceDetailPopup function before AdminPackageEditor (line 392)
2. Add infoAddon state to PackageCard (after line 849)
3. Add info button to each addon row (after the price div, before closing button tag)
4. Render ServiceDetailPopup at the end of PackageCard return
"""

filepath = r"components\incorporation\IncorporationDashboard.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# ── 1. Insert ServiceDetailPopup before AdminPackageEditor ──────────────────
SERVICE_DETAIL_POPUP = '''// ─── Service Detail Popup ────────────────────────────────────────────────────
function ServiceDetailPopup({
    addon,
    onClose,
}: {
    addon: Addon;
    onClose: () => void;
}) {
    const info = SERVICE_INFO[addon.id];
    const link = addon.serviceLink || info?.defaultLink || "#";

    if (!info) return null;

    return (
        <div
            className="fixed inset-0 z-[300] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div
                className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-5 text-white">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="text-3xl mb-2">{addon.emoji}</div>
                            <h3 className="text-base font-black leading-tight">{addon.name}</h3>
                            <div className="mt-1.5 inline-flex items-center gap-1 bg-white/20 px-2.5 py-1 rounded-full">
                                <span className="text-xs font-black">+\u20b9{addon.price.toLocaleString()}</span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
                        >
                            <span className="material-icons text-sm">close</span>
                        </button>
                    </div>
                </div>
                {/* Body */}
                <div className="p-5">
                    <div className="mb-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">What is this?</p>
                        <p className="text-sm text-slate-700 leading-relaxed">{info.what}</p>
                    </div>
                    <div className="mb-5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Benefits</p>
                        <ul className="space-y-2">
                            {info.benefits.map((b, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                                    <span className="material-icons text-green-500 text-base flex-shrink-0 mt-0.5">check_circle</span>
                                    {b}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-black text-sm shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02] transition-all"
                    >
                        <span className="material-icons text-sm">open_in_new</span>
                        Get More Details
                    </a>
                </div>
            </div>
        </div>
    );
}

'''

ADMIN_MARKER = "// ─── Admin Package Editor Modal"
content = content.replace(ADMIN_MARKER, SERVICE_DETAIL_POPUP + ADMIN_MARKER, 1)

# ── 2. Add infoAddon state to PackageCard ───────────────────────────────────
OLD_STATE = "    const [selectedAddons, setSelectedAddons] = useState<string[]>([]);"
NEW_STATE = """    const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
    const [infoAddon, setInfoAddon] = useState<Addon | null>(null);"""
content = content.replace(OLD_STATE, NEW_STATE, 1)

# ── 3. Add info button to each addon row (after the price div) ───────────────
OLD_PRICE_DIV = """                                    {/* Price */}
                                    <div className="text-right flex-shrink-0">
                                        <div className={`text-xs font-black ${isSelected ? "text-indigo-600" : "text-slate-700"
                                            }`}>+\u20b9{addon.price.toLocaleString()}</div>
                                    </div>
                                </button>"""

NEW_PRICE_DIV = """                                    {/* Price */}
                                    <div className="text-right flex-shrink-0">
                                        <div className={`text-xs font-black ${isSelected ? "text-indigo-600" : "text-slate-700"
                                            }`}>+\u20b9{addon.price.toLocaleString()}</div>
                                    </div>

                                    {/* Info button */}
                                    {SERVICE_INFO[addon.id] && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setInfoAddon(addon); }}
                                            className="w-6 h-6 rounded-full bg-slate-100 hover:bg-indigo-100 text-slate-400 hover:text-indigo-600 flex items-center justify-center flex-shrink-0 transition-colors"
                                            title="Learn more"
                                        >
                                            <span className="material-icons text-[13px]">info</span>
                                        </button>
                                    )}
                                </button>"""

content = content.replace(OLD_PRICE_DIV, NEW_PRICE_DIV, 1)

# ── 4. Render ServiceDetailPopup at end of PackageCard return ────────────────
# Find the closing of the PackageCard return — the last </div> before the closing );
# We'll insert the popup just before the final closing </div> of the card
OLD_CARD_END = """            {/* ── Add-ons Dropdown Panel ── */}"""
# We need to find the very end of the PackageCard return and add the popup render there
# The PackageCard ends with:  </div>\n    );\n}\n
# Let's find a unique marker near the end of PackageCard

# Find the summary/price section at the bottom of the addons dropdown
OLD_SUMMARY = """                </div>
            </div>
        </div>
    );
}

// ─── GetStartedModal"""

NEW_SUMMARY = """                </div>
            </div>

            {/* Service Detail Popup */}
            {infoAddon && (
                <ServiceDetailPopup addon={infoAddon} onClose={() => setInfoAddon(null)} />
            )}
        </div>
    );
}

// ─── GetStartedModal"""

content = content.replace(OLD_SUMMARY, NEW_SUMMARY, 1)

with open(filepath, "w", encoding="utf-8", newline="\r\n") as f:
    f.write(content)

# Verify
with open(filepath, "r", encoding="utf-8") as f:
    final = f.read()

print("ServiceDetailPopup function:", "function ServiceDetailPopup" in final)
print("infoAddon state:", "infoAddon" in final)
print("Info button:", "setInfoAddon(addon)" in final)
print("Popup render:", "infoAddon && (" in final)
print("File size:", len(final))
