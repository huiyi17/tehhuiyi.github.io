import React from 'react'

export const GlobalFilter = ({filter, setFilter}) => {

    const searchBarInput = {
        backgroundColor: "var(--color-white2)",
        textAlign: "center",
        fontSize: "13px",
        fontStyle: "normal",
        fontWeight: "400",
        lineHeight: "normal",
        marginTop: "10px",
        marginBottom: "10px",
        padding: "0",
        width: "605px",
        height: "32px",
        flexShrink: "0",
        borderRadius: "12px",
        border: "none",
      };

    // filter: value of the text input
    return (
        <input value={filter || ''}
            onChange={e => setFilter(e.target.value)} 
            placeholder='Search...'
            style={searchBarInput}
        />
    )
}