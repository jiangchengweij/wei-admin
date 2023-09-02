import type { AdminMenu } from "@/stores/interface"

export interface Axis {
    x: number
    y: number
}

export interface ContextMenuItem {
    name: string
    label: string
    icon?: string
    disabled?: boolean
}

export interface ContextmenuItemClickEmitArg extends ContextMenuItem {
    menu?: AdminMenu
}

export interface Props {
    width?: number
    items: ContextMenuItem[]
}
