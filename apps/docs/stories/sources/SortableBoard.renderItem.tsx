import {SortableBoard, Card, CardDescription, CardHeader, CardTitle} from "@traxion-global/design-system/react";
import {CalendarIcon, MapPin, Tag} from "lucide-react";
import * as React from "react";

const tasksData = {
    "1": {
        title: "Recoger paquete en almacén",
        location: "Almacén Central",
        date: "2024-07-01",
    },
    "2": {
        title: "Entregar paquete a cliente",
        location: "Calle Falsa 123",
        date: "2024-07-02",
    },
    "3": {
        title: "Coordinar transporte",
        location: "Oficina de Logística",
        date: "2024-07-03",
    },
    "4": {
        title: "Verificar inventario",
        location: "Almacén Secundario",
        date: "2024-07-04",
    }
};

export default function SortableBoardRenderItem() {

    return <div className={"overflow-hidden overflow-x-auto sm:overflow-x-hidden"}>
        <div className={"w-[750px] sm:w-[900px] h-[500px]"}>
            <SortableBoard
                defaultColumns={[
                    {
                        title: 'Para hacer',
                        items: ["1", "2", "3"],
                    },
                    {
                        title: 'En progreso',
                        items: ["4"],
                    }
                ]}
                renderItem={item => (
                    <Card className={"border-none shadow-none"}>
                        <CardHeader className={"p-2"}>
                            <CardTitle className={"flex flex-row gap-2 mb-2"}>
                                <Tag className={"h-4 w-4"}/>
                                <span>{tasksData[item].title}</span>
                            </CardTitle>
                            <CardDescription className={"flex flex-col justify-between gap-2 text-xs sm:text-sm"}>
                                <div className={"flex items-center gap-2"}><MapPin className={"w-4 h-4"}/>{tasksData[item].location}</div>
                                <div className={"flex items-center gap-2"}><CalendarIcon className={"w-4 h-4"}/>{tasksData[item].date}</div>
                            </CardDescription>
                        </CardHeader>
                    </Card>
                )}
            />
        </div>
    </div>
}