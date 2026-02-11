export const SortableBoardSizing = `
### Tamaño del tablero
El componente **SortableBoard** adapta su tamaño al contenedor padre. Para controlar el tamaño del tablero, envuélvelo en un contenedor con las dimensiones deseadas utilizando clases de Tailwind o estilos en línea.
\`\`\`jsx
//Tamaño fijo
<div className="w-[900px] h-[500px]">
    <SortableBoard/>
</div>
//Con scroll para movil
<div className={"overflow-hidden overflow-x-auto sm:overflow-x-hidden"}>
    <div className={"w-[750px] sm:w-[900px] h-[500px]"}>
        <SortableBoard />
    </div>
</div>
\`\`\`
`;