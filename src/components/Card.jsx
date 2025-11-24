import React from 'react';

export default function Card({ title, children }) {
    return (
        <div className="p-4 rounded shadow card">
            {title && <h4 className="font-medium mb-2">{title}</h4>}
            <div>{children}</div>
        </div>
    )
}
