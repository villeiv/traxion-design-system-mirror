import { SortableBoard, ColumnType, toast } from "@traxion-global/design-system";
import * as React from "react";

export default function SortableBoardOnChange(){

    function handleChange(items: ColumnType[]){
        toast.success("La carga ha sido modificada. Revisa la consola para más detalles.");
        console.log(items)
    }

    return <div className={"overflow-hidden overflow-x-auto sm:overflow-x-hidden"}>
        <div className={"w-[750px] sm:w-[900px] h-[500px]"}>
            <SortableBoard
                defaultColumns={[
                    {
                        id: 'truck',
                        title: 'Camión de carga',
                        items: [
                            "Paquete #12345",
                            "Paquete #67890",
                            "Paquete #54321"
                        ],
                    },
                    {
                        id: 'ship',
                        title: 'Tren de mercancías',
                        items: [
                            "Paquete #98765",
                            "Paquete #43210"
                        ],
                    }
                ]}
                onChange={handleChange}
            />
        </div>
    </div>

}