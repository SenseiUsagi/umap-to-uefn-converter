import { childrenProps, childrenPropsOptional } from "../constants";

// This file basically contains component versions of the normal grid system

type divAttributes = React.HTMLAttributes<HTMLDivElement>;

export function Container({ className = "", children }: divAttributes) {
    return <div className={`container ${className}`}>{children}</div>;
}

export function Row({ className = "", children }: divAttributes) {
    return <div className={`row ${className}`}>{children}</div>;
}

interface columnProps extends divAttributes {
    size: ColumnSizes;
}

type ColumnSizes = 1 | 1.5 | 2 | 3 | 4 | 6;

const ColumnSizeClass: Record<ColumnSizes, string> = {
    1: "col-1",
    1.5: "col-1-5",
    2: "col-2",
    3: "col-3",
    4: "col-4",
    6: "col-6",
};

export function Column({ className = "", children, size }: columnProps) {
    return <div className={`${ColumnSizeClass[size]} ${className}`}>{children}</div>;
}
