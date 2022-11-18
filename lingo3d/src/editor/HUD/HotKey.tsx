interface HotKeysProps {
    hotkey?: string
    description?: string
}

export default ({ hotkey, description }: HotKeysProps) => {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                marginTop: 4,
                whiteSpace: "nowrap"
            }}
        >
            <div
                style={{
                    border: "1px solid white",
                    borderRadius: "4px",
                    padding: "2px 4px 2px 4px"
                }}
            >
                <div className="lingo3d-flexcenter" style={{ minWidth: 10 }}>
                    {hotkey}
                </div>
            </div>
            {hotkey && description && (
                <div style={{ padding: "0 1px 0 1px" }}>&nbsp;-&nbsp;</div>
            )}
            <div style={{ padding: "2px 0px 2px 0px" }}>{description}</div>
        </div>
    )
}
