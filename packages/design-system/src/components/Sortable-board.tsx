import {closestCorners, DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, UniqueIdentifier} from "@dnd-kit/core";
import {arrayMove, SortableContext, useSortable, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {HTMLAttributes, ReactNode, useState} from "react";
import {useDesignSystemLanguage} from "./Language-provider";

const SORTABLE_BOARD_TEXTS = {
    en: { emptyColumn: "You can drag elements here." },
    es: { emptyColumn: "Puedes arrastrar elementos aquí." },
} as const
import {CSS} from "@dnd-kit/utilities";
import {Badge} from "./Badge";
import {GripVertical} from "lucide-react";
import {cn} from "@/lib/utils";

//TODO: orientation vertical/horizontal

type RenderItem = {
    renderItem?: (id: string) => ReactNode;
}

type DefaultColumnType = {
    id?: string;
    title: string;
    items: string[];
}

type ColumnType = {
    title: string;
    items: string[];
    id: string;
};

type SortableBoardProps = {
    defaultColumns: DefaultColumnType[];
    onChange?: (columns: ColumnType[]) => void;
} & RenderItem;

type SortableItemProps = {
    id: string;
} & RenderItem;

type SortableItemViewProps = {
    children: ReactNode;
    isDragging?: boolean;
    customRender?: boolean;
    isInOverlay?: boolean;
    ref?: (node: HTMLDivElement | null) => void;
} & HTMLAttributes<HTMLDivElement>;

type ItemOverlayProps = {
    activeId: UniqueIdentifier | null;
} & RenderItem;

type ColumnProps = ColumnType & RenderItem & { emptyText: string };

function SortableBoard({defaultColumns, onChange, renderItem}: SortableBoardProps) {
    // Si la columna no define id, asignamos uno determinista para evitar errores de hydration
    const [columns, setColumns] = useState<ColumnType[]>(() =>
        defaultColumns.map((c, idx) => ({...c, id: c.id ?? `col-${idx}`}))
    );
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const language = useDesignSystemLanguage();
    const t = SORTABLE_BOARD_TEXTS[language];

    function findContainerIndex(id: UniqueIdentifier): number {
        return columns.findIndex((c) => c.id === id || c.items.includes(String(id)));
    }

    function handleDragStart(event: DragStartEvent): void {
        setActiveId(event.active.id);
    }

    function handleDragOver(event: DragOverEvent): void {
        const {active, over} = event;

        if (!over?.id) return;

        const fromIdx = findContainerIndex(active.id);
        const toIdx = findContainerIndex(over.id);

        if (fromIdx === -1 || toIdx === -1) return;

        if (fromIdx !== toIdx) {
            //Hack to avoid el problema de maximum update depth exceeded
            setTimeout(() =>
                    setColumns((prev => {
                        const next = [...prev];
                        const fromCol = next[fromIdx];
                        const toCol = next[toIdx];

                        const fromItems = [...fromCol.items];
                        const toItems = [...toCol.items];

                        const fromPos = fromItems.indexOf(String(active.id));
                        if (fromPos === -1) return prev; // nada que mover

                        const overPos = toItems.indexOf(String(over.id));
                        const insertAt = overPos >= 0 ? overPos : toItems.length;

                        // mover
                        fromItems.splice(fromPos, 1);
                        toItems.splice(insertAt, 0, String(active.id));

                        // reasigna SOLO esas columnas
                        next[fromIdx] = {...fromCol, items: fromItems};
                        next[toIdx] = {...toCol, items: toItems};

                        return next;
                    }))
                , 0);
        }
    }

    function handleDragEnd(event: DragEndEvent) {
        const {active, over} = event;
        if (!over) return;

        const fromIdx = findContainerIndex(active.id);
        const toIdx = findContainerIndex(over.id);
        if (fromIdx === -1 || toIdx === -1) return;

        if (fromIdx === toIdx) {
            // reordenar dentro de la misma columna y notificar
            const next = (() => {
                const draft = columns.map((c) => ({...c, items: [...c.items]}));
                const items = draft[fromIdx].items;
                const oldIndex = items.indexOf(String(active.id));
                const newIndex = items.indexOf(String(over.id));
                if (oldIndex !== newIndex) {
                    draft[fromIdx].items = arrayMove(items, oldIndex, newIndex);
                }
                return draft;
            })();

            setColumns(next);
            onChange?.(next);
        } else {
            // ya se movió en dragOver; el estado actual refleja el cambio
            onChange?.(columns);
        }

        setActiveId(null);
    }

    return <DndContext
        //Sin este id hay un eeror en next js
        id="dndContext"
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
    >
        <ColumnsWrapper>{
            columns.map(col => <Column key={col.id} id={col.id} title={col.title} items={col.items} renderItem={renderItem} emptyText={t.emptyColumn}/>)
        }</ColumnsWrapper>

        <ItemOverlay renderItem={renderItem} activeId={activeId}/>
    </DndContext>
}

function ColumnsWrapper({children}: { children: ReactNode }) {
    //El contenedor de las columnas ocupará to do el espacio disponible del padre tanto en ancho como alto
    const styles = {
        wrapper: "grid gap-4 w-full h-full grid-cols-[repeat(auto-fit,minmax(0,1fr))]"
    };
    return <div className={styles.wrapper}>{children}</div>;
}

function Column({id, title, items, renderItem, emptyText}: ColumnProps) {
    const {active, over, setNodeRef} = useSortable({id});
    const styles = {
        //Las columnas ocuparan to do el ancho disponible
        column: "h-full grid grid-rows-[auto_1fr] min-h-0 rounded-lg border",
        columnHeader: "flex gap-2 p-4 rounded-lg rounded-b-none text-sm font-medium bg-secondary text-white",
        headerBadge: "h-5 w-5 flex justify-center p-0 bg-secondary-light text-foreground",
        itemsWrapper: "overflow-y-auto min-h-0 flex flex-col p-4 gap-3",
        itemsWrapperOver: "bg-muted",
        dragItemsWrapper: "h-10 rounded border border-dashed flex items-center justify-center text-xs text-muted-foreground",
    };

    const isOverContainer = over
        ? (id === over.id && active?.data.current?.type !== 'container') ||
        items.includes(String(over.id))
        : false;

    return (
        <div ref={setNodeRef} className={cn(styles.column, isOverContainer ? styles.itemsWrapperOver : null)}>
            <div className={styles.columnHeader}>
                {title}
                <Badge variant={"outline"} className={styles.headerBadge}>{items.length}</Badge>
            </div>
            <div className={cn(styles.itemsWrapper)}>
                <SortableContext items={items} strategy={verticalListSortingStrategy}>
                    {items.map((id) => (
                        <SortableItem
                            key={id}
                            id={id}
                            renderItem={renderItem}
                        />
                    ))}
                </SortableContext>
                {items.length === 0 && (
                    <div className={styles.dragItemsWrapper}>
                        {emptyText}
                    </div>
                )}
            </div>
        </div>
    );
}

function SortableItem({id, renderItem}: SortableItemProps) {
    const {attributes, listeners, setNodeRef, transform, transition, isDragging, setActivatorNodeRef,} = useSortable({id});
    const movingStyles = {transform: CSS.Transform.toString(transform), transition};

    return (
        <div ref={setNodeRef} style={movingStyles}>{
            <SortableItemView {...listeners} {...attributes} ref={setActivatorNodeRef} isDragging={isDragging} customRender={!!renderItem}>{
                renderItem ? renderItem(id) : id
            }</SortableItemView>
        }</div>
    );
}

function SortableItemView({children, isDragging, customRender, isInOverlay, ...props}: SortableItemViewProps) {
    const styles = {
        itemWrapper: "flex items-start border p-2 rounded-lg bg-white overflow-hidden",
        draggingItemWrapper: "opacity-50 border-2 border-dashed",
        draggableOverlayWrapper: "transition-shadow hover:shadow-lg border-secondary/50",
        contentWrapper: "items-center flex-grow min-h-8 ",
        simpleItem: "text-sm min-h-8 flex items-center",
    };

    return <div className={cn(styles.itemWrapper, isDragging ? styles.draggingItemWrapper : null, isInOverlay ? styles.draggableOverlayWrapper : null)}>
        <div className={styles.contentWrapper}>{
            customRender ? <>{children}</> : <div className={styles.simpleItem}>{children}</div>
        }</div>
        <DraggingKnob {...props}/>
    </div>;
}

function DraggingKnob({...props}) {
    const preventScrollOnKnobStyle = "touch-none";
    const styles = {
        knobWrapper: "flex justify-center items-center h-8 w-8 rounded cursor-grab active:cursor-grabbing bg-muted/80 hover:bg-muted " + preventScrollOnKnobStyle
    };
    return <div className={styles.knobWrapper} {...props}>
        <GripVertical className="h-4 w-4 text-muted-foreground"/>
    </div>
}

function ItemOverlay({activeId, renderItem}: ItemOverlayProps) {
    return <DragOverlay>
        {activeId ? (
            <SortableItemView customRender={!!renderItem} isInOverlay={true}>{
                renderItem ? renderItem(String(activeId)) : String(activeId)
            }</SortableItemView>
        ) : null}
    </DragOverlay>
}

export {
    SortableBoard
}

export type {
    ColumnType
}

/*
SortableBoard
Componente de tablero con columnas y elementos arrastrables.

ColumnsWrapper
Componente contenedor para las Column del tablero.

Column
Componente de columna que contiene elementos arrastrables.

SortableItem
Componente de elemento arrastrable dentro de una columna.

SortableItemView
Componente de vista para un elemento arrastrable.

DraggingKnob
Componente de perilla para arrastrar elementos.

ItemOverlay
Componente visible cuando se arrastra un elemento SortableItem.
*/
