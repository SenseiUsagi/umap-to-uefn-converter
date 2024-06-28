import { childrenProps, childrenPropsOptional } from "../constants";

// This file basically contains component versions of the normal grid system

export function Container({ children }: childrenProps) {
    return <div className="container">{children}</div>;
}

export function Row({ children }: childrenProps) {
    return <div className="row">{children}</div>;
}

interface columnProps extends childrenPropsOptional {
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

export function Column({ children, size }: columnProps) {
    return <div className={ColumnSizeClass[size]}>{children}</div>;
}
