"use client";

import * as React from "react";
import {ReactNode, useState, Suspense} from "react";
import {cn} from "@traxion-global/design-system";
import {
    Accordion, AccordionContent, AccordionItem, AccordionTrigger,
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
    Avatar, AvatarFallback, AvatarImage,
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
    Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut,
    Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
    DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator,
    DropdownMenuShortcut, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, DropdownMenuGroup, DropdownMenuSub,
    HoverCard, HoverCardContent, HoverCardTrigger,
    Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
    Popover, PopoverContent, PopoverTrigger,
    RadioGroup, RadioGroupItem,
    Select, SelectContent, SelectGroup, SelectItem, SelectLabel as SelectGroupLabel, SelectSeparator as SelectGroupSeparator, SelectTrigger, SelectValue,
    Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger,
    Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow,
    Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
    Badge, Button, Calendar, Checkbox, Input, Label, Progress, Separator, Switch, Textarea, toast,
    InfoCard, FileDropZone, NoDataMessage, InlineLoader, FullPageOverlayLoader, SortableBoard,
    DataTable, DataTableColumnHeader, DataTablePagination, DataTableToolbar, DataTableViewOptions
} from "@traxion-global/design-system/react";

import {
    Ban, BatteryLow, Calendar1Icon, CalendarIcon, ClockAlert, DollarSign, DoorOpen, MapPin, PackageOpen, RouteOff, Tag, ThermometerSnowflake, User, XIcon,
    Plus, PenLine, Trash2, Copy, Download, UploadIcon, Eye, EyeOff, SearchIcon, Filter, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Menu, X, Settings, Bell,
    Home, MailIcon, MessageSquare, Phone, Send, Share, Globe, Wifi, Bluetooth, File, FileText, FilePlus, Folder, FolderPlus, Save, Database, BarChart,
    Truck, Package, Warehouse, Map, Navigation, Compass, Route, Clipboard, ClipboardCheck, ShoppingCart, ShoppingBag, CreditCard, Percent, Bookmark, Gift, Smartphone,
    Tablet, Laptop, Monitor, Printer, Camera, Headphones, Speaker, AlertCircle, AlertTriangle, CheckCircle, XCircle, Info, HelpCircle, ThumbsUp, ThumbsDown,
    Lock, Unlock, Shield, Key, Fingerprint, Heart, Activity, Stethoscope, Pill, AmbulanceIcon as FirstAid, Coffee, Zap, Award, Flag,
    Star, SquareArrowOutUpRight, PanelRightOpen, MoreHorizontal, ArrowUpDown
} from "lucide-react";

import type { ColumnDef } from "@tanstack/react-table";
import {
    useReactTable,
    getCoreRowModel
} from "@tanstack/react-table";
import { useDataTable, useDebouncedCallback } from "@traxion-global/design-system/react";
import { useRouter, useSearchParams } from "next/navigation";

/*import {cn} from "@/lib/utils";

import {useForm} from "react-hook-form";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";*/

// Nota: Este archivo asume que copiaste la carpeta `ui/` a `components/ui/`
// y que tienes configurado el alias `@/` a la raíz del proyecto (tsconfig.json -> compilerOptions.paths).
//
// Objetivo: muestra del design system con ejemplos mínimos y tips de uso.

function Section({title, description, children}: { title: string; description?: string; children: React.ReactNode }) {
    return (
        <Card className="rounded-2xl">
            <CardHeader className={"p-4 sm:p-6 pb-0 sm:pb-0"}>
                <CardTitle className="text-xl">{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-4 p-4 sm:p-6">{children}</CardContent>
        </Card>
    );
}

type ColorSwatchProps = {
    name: string;
    color: string;
    className?: string;
}

function ColorSwatch({name, color, className }: ColorSwatchProps) {
    return (
        <div className={cn(`flex flex-col h-16 sm:h-20 rounded-md flex items-center justify-center `, className)}>
            <span className="sm:text-lg">{name}</span>
            <span className="text-sm opacity-80">{color}</span>
        </div>
    )
}


export default function DesignSystemShowcase() {
    const [progress, setProgress] = useState(33);
    const [loading, setLoading] = useState(false);

    /* Demo react-hook-form
    const form = useForm<{ email: string; role: string; newsletter: boolean }>({
        defaultValues: {email: "", role: "viewer", newsletter: true},
    });*/

    return (
        <div className="container mx-auto max-w-6xl px-4 py-10 space-y-8">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Design System — Showcase</h1>
                    <p className="text-muted-foreground">
                        Esta página demuestra todos los componentes disponibles y da tips rápidos para usarlos en tus features.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <User className="h-4 w-4"/>
                        <span>Design System</span>
                    </div>
                    <Separator orientation="vertical" className="h-8"/>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className={"cursor-pointer"}>
                                <AvatarImage src="https://avatars.github" alt="demo"/>
                                <AvatarFallback>DS</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium leading-none">Design System</span>
                                    <span className="text-xs text-muted-foreground">design@company.com</span>
                                </div>
                            </DropdownMenuLabel>

                            <DropdownMenuSeparator/>

                            <DropdownMenuGroup>
                                <DropdownMenuItem>Perfil</DropdownMenuItem>
                                <DropdownMenuItem>Facturación</DropdownMenuItem>
                                <DropdownMenuItem>Configuración</DropdownMenuItem>
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator/>

                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>Tema</DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem>Claro</DropdownMenuItem>
                                    <DropdownMenuItem>Oscuro</DropdownMenuItem>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuItem>Sistema</DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>

                            <DropdownMenuSeparator/>

                            <DropdownMenuCheckboxItem checked>
                                Notificaciones
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem>
                                Emails
                            </DropdownMenuCheckboxItem>

                            <DropdownMenuSeparator/>

                            <DropdownMenuRadioGroup value="es">
                                <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="es">Español</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>

                            <DropdownMenuSeparator/>

                            <DropdownMenuItem>
                                Cerrar sesión
                                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>


                </div>
            </div>
            {/* DataTable */}
            <Section
                title="DataTable"
                description="Tabla de datos avanzada con paginación, ordenamiento, filtros, selección de filas, visibilidad de columnas y reordenamiento mediante drag & drop."
            >
                <Suspense fallback={<div className="flex items-center justify-center p-8"><InlineLoader /></div>}>
                    <DataTableURLDemo />
                </Suspense>

                <Separator className="my-8" />

                <div>
                    <h3 className="text-lg font-semibold mb-2">Real API Example</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Fetches invoice data from a real API with server-side pagination and filtering.
                    </p>
                    <Suspense fallback={<div className="flex items-center justify-center p-8"><InlineLoader /></div>}>
                        <DataTableAPIDemo />
                    </Suspense>
                </div>
            </Section>
            {/* Tokens */}
            <Section title="Tokens" description="Colores de marca, escala de espacio, tipografía y sombras.">
                {/* Colores */}
                <div className="space-y-4">
                    <h3 className="font-medium">Colores de marca</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <ColorSwatch name="Primary" color="#D0DF00" className="bg-primary text-primary-foreground"/>
                        <ColorSwatch name="Secondary" color="#63666A" className="bg-secondary text-secondary-foreground"/>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <ColorSwatch name="Primary light" color="#E3E935" className="bg-primary-light text-primary-foreground"/>
                        <ColorSwatch name="Primary dark" color="#B5BD00" className="bg-primary-dark text-secondary-foreground"/>
                        <ColorSwatch name="Secondary light" color="#D0D0CE" className="bg-secondary-light text-primary-foreground"/>
                        <ColorSwatch name="Secondary medium" color="#97999B" className="bg-secondary-medium text-white"/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <ColorSwatch name="White" color="#FFFFFF" className="bg-white text-black border"/>
                        <ColorSwatch name="Black" color="#000000" className="bg-black text-white"/>
                    </div>
                </div>

                {/* Espaciado */}
                <div className="space-y-4 mt-6">
                    <h3 className="font-medium">Escala de espacio</h3>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary h-4 w-1"/>
                            <span className="text-xs">w-1</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="bg-primary h-4 w-2"/>
                            <span className="text-xs">w-2</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="bg-primary h-4 w-3"/>
                            <span className="text-xs">w-3</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="bg-primary h-4 w-4"/>
                            <span className="text-xs">w-4</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="bg-primary h-4 w-6"/>
                            <span className="text-xs">w-6</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="bg-primary h-4 w-8"/>
                            <span className="text-xs">w-8</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="bg-primary h-4 w-12"/>
                            <span className="text-xs">w-12</span>
                        </div>
                    </div>
                </div>

                {/* Tipografía */}
                <div className="space-y-4 mt-6">
                    <h3 className="font-medium">Tipografía</h3>
                    <p className="text-sm">Este proyecto usa la fuente base configurada en Tailwind.</p>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight">Heading 1</h1>
                        <h2 className="text-3xl font-semibold tracking-tight">Heading 2</h2>
                        <h3 className="text-2xl font-semibold">Heading 3</h3>
                        <p className="text-base">Texto normal</p>
                        <p className="text-muted-foreground">Texto muted</p>
                    </div>
                </div>

                {/* Sombras */}
                <div className="space-y-4 mt-6">
                    <h3 className="font-medium">Sombras</h3>
                    <div className="flex gap-4 flex-wrap">
                        <div className="w-24 h-16 rounded-lg shadow-sm bg-white flex items-center justify-center text-xs">sm</div>
                        <div className="w-24 h-16 rounded-lg shadow-md bg-white flex items-center justify-center text-xs">md</div>
                        <div className="w-24 h-16 rounded-lg shadow-lg bg-white flex items-center justify-center text-xs">lg</div>
                        <div className="w-24 h-16 rounded-lg shadow-xl bg-white flex items-center justify-center text-xs">xl</div>
                    </div>
                </div>

                {/* Border radius */}
                <div className="space-y-4 mt-6">
                    <h3 className="font-medium">Border radius</h3>
                    <div className="flex gap-4 flex-wrap items-end">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-16 h-16 bg-primary rounded-none border"/>
                            <span className="text-xs">none</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-16 h-16 bg-primary rounded-sm border"/>
                            <span className="text-xs">sm</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-16 h-16 bg-primary rounded-md border"/>
                            <span className="text-xs">md</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-16 h-16 bg-primary rounded-lg border"/>
                            <span className="text-xs">lg</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-16 h-16 bg-primary rounded-xl border"/>
                            <span className="text-xs">xl</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-16 h-16 bg-primary rounded-2xl border"/>
                            <span className="text-xs">2xl</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-16 h-16 bg-primary rounded-3xl border"/>
                            <span className="text-xs">3xl</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-16 h-16 bg-primary rounded-full border"/>
                            <span className="text-xs">full</span>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Badges */}
            <Section title="Badges" description="Primarias para casos comunes, estados predefinidos para flujos de negocio y auxiliares para etiquetas adicionales.">
                {/* Primarias */}
                <div className="space-y-2">
                    <h3 className="text-sm font-medium">Primarias</h3>
                    <div className="flex flex-wrap gap-2">
                        <Badge>Default</Badge>
                        <Badge variant="primary">Primary</Badge>
                        <Badge variant="secondary">Secondary</Badge>
                        <Badge variant="destructive">Destructive</Badge>
                        <Badge variant="outline">Outline</Badge>
                    </div>
                </div>

                {/* estados */}
                <div className="space-y-2 mt-4">
                    <h3 className="text-sm font-medium">Estados de facturas, viajes, etc.</h3>
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="green">Verde: exito</Badge>
                        <Badge variant="yellow">Amarillo: pendiente</Badge>
                        <Badge variant="red">Rojo: cancelado</Badge>
                        <Badge variant="gray">Gris: neutro</Badge>
                    </div>
                </div>

                {/* auxiliares */}
                <div className="space-y-2 mt-4">
                    <h3 className="text-sm font-medium">Auxiliares</h3>
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="cyan">Cyan</Badge>
                        <Badge variant="violet">Violeta</Badge>
                        <Badge variant="blue">Azul</Badge>
                        <Badge variant="teal">Teal</Badge>
                        <Badge variant="orange">Naranja</Badge>
                        <Badge variant="pink">Rosa</Badge>
                        <Badge variant="fuchsia">Fucsia</Badge>
                    </div>
                </div>
            </Section>

            {/* Buttons */}
            <Section
                title="Buttons"
                description="Usa variantes para semántica visual; no inventes colores por componente. Usa `variant` y `size`."
            >
                <div className="flex flex-wrap gap-2">
                    <Button>Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button size="sm">sm</Button>
                    <Button size="lg">lg</Button>
                    <Button size="icon" aria-label="Icon button">
                        <XIcon className="h-4 w-4"/>
                    </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                    Tip: Usa los tokens de diseño que ya están definidos en Tailwind en lugar de
                    crear clases ad-hoc para cada botón.
                </p>
            </Section>

            {/* Inputs */}
            <Section title="Inputs & Textarea" description="Inputs básicos con label, descripción y mensajes.">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" placeholder="john@acme.com"/>
                        <p className="text-xs text-muted-foreground">Tip: usa `aria-*` + `htmlFor` para accesibilidad.</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" placeholder="Escribe algo..."/>
                    </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label>Adjuntos</Label>
                    <FileDropZone
                        onFiles={(files) => {
                            alert("Archivos seleccionados:" + files[0]?.name);
                        }}
                    />
                    <p className="text-xs text-muted-foreground">
                        Puedes arrastrar archivos o hacer clic para seleccionarlos.
                    </p>
                </div>

            </Section>

            {/* Info Cards */}
            <Section
                title="Info Cards"
                description="Cajas compactas para resaltar datos clave como periodos, fechas o totales."
            >
                <div className="grid gap-4 sm:grid-cols-3">
                    <InfoCard title="Period" value="June" icon={<Calendar1Icon className="h-6 w-6"/>}/>
                    <InfoCard title="Payment date" value="14/6/2025" icon={<Calendar1Icon className="h-6 w-6"/>}/>
                    <InfoCard title="Total" value="$357,971.86" icon={<DollarSign className="h-6 w-6"/>}/>
                </div>
            </Section>

            {/* Íconos */}
            <Section
                title="Íconos"
                description="Los iconos provienen de la librería Lucide y pueden importarse individualmente. Busca por nombre o palabra clave en el sitio oficial: https://lucide.dev/icons/ para encontrar el icono que necesites."
            >
                <div>
                    <h3 className="text-base font-medium mb-3">Acciones básicas</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                        <div className="flex flex-col items-center">
                            <Plus className="h-6 w-6"/>
                            <span className="text-xs mt-1">Crear</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <PenLine className="h-6 w-6"/>
                            <span className="text-xs mt-1">Editar</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Trash2 className="h-6 w-6"/>
                            <span className="text-xs mt-1">Eliminar</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Copy className="h-6 w-6"/>
                            <span className="text-xs mt-1">Copiar</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Download className="h-6 w-6"/>
                            <span className="text-xs mt-1">Descargar</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <UploadIcon className="h-6 w-6"/>
                            <span className="text-xs mt-1">Subir</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Eye className="h-6 w-6"/>
                            <span className="text-xs mt-1">Ver</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <EyeOff className="h-6 w-6"/>
                            <span className="text-xs mt-1">Ocultar</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <SearchIcon className="h-6 w-6"/>
                            <span className="text-xs mt-1">Buscar</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Filter className="h-6 w-6"/>
                            <span className="text-xs mt-1">Filtrar</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-base font-medium mb-3">Navegación y UI</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                        <div className="flex flex-col items-center">
                            <ChevronDown className="h-6 w-6"/>
                            <span className="text-xs mt-1">Abajo</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <ChevronUp className="h-6 w-6"/>
                            <span className="text-xs mt-1">Arriba</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <ChevronLeft className="h-6 w-6"/>
                            <span className="text-xs mt-1">Izquierda</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <ChevronRight className="h-6 w-6"/>
                            <span className="text-xs mt-1">Derecha</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Menu className="h-6 w-6"/>
                            <span className="text-xs mt-1">Menú</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <X className="h-6 w-6"/>
                            <span className="text-xs mt-1">Cerrar</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Settings className="h-6 w-6"/>
                            <span className="text-xs mt-1">Ajustes</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Bell className="h-6 w-6"/>
                            <span className="text-xs mt-1">Notificación</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Home className="h-6 w-6"/>
                            <span className="text-xs mt-1">Inicio</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <User className="h-6 w-6"/>
                            <span className="text-xs mt-1">Usuario</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-base font-medium mb-3">Logística y transporte</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                        <div className="flex flex-col items-center">
                            <Truck className="h-6 w-6"/>
                            <span className="text-xs mt-1">Camión</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Package className="h-6 w-6"/>
                            <span className="text-xs mt-1">Paquete</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Warehouse className="h-6 w-6"/>
                            <span className="text-xs mt-1">Almacén</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Map className="h-6 w-6"/>
                            <span className="text-xs mt-1">Mapa</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <MapPin className="h-6 w-6"/>
                            <span className="text-xs mt-1">Ubicación</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Navigation className="h-6 w-6"/>
                            <span className="text-xs mt-1">Navegación</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Compass className="h-6 w-6"/>
                            <span className="text-xs mt-1">Brújula</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Route className="h-6 w-6"/>
                            <span className="text-xs mt-1">Ruta</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Clipboard className="h-6 w-6"/>
                            <span className="text-xs mt-1">Portapapeles</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <ClipboardCheck className="h-6 w-6"/>
                            <span className="text-xs mt-1">Verificado</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-base font-medium mb-3">Comercio y finanzas</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                        <div className="flex flex-col items-center">
                            <ShoppingCart className="h-6 w-6"/>
                            <span className="text-xs mt-1">Carrito</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <ShoppingBag className="h-6 w-6"/>
                            <span className="text-xs mt-1">Bolsa</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <CreditCard className="h-6 w-6"/>
                            <span className="text-xs mt-1">Tarjeta</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <DollarSign className="h-6 w-6"/>
                            <span className="text-xs mt-1">Precio</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Percent className="h-6 w-6"/>
                            <span className="text-xs mt-1">Descuento</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Tag className="h-6 w-6"/>
                            <span className="text-xs mt-1">Etiqueta</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Bookmark className="h-6 w-6"/>
                            <span className="text-xs mt-1">Guardar</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Gift className="h-6 w-6"/>
                            <span className="text-xs mt-1">Regalo</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-base font-medium mb-3">Archivos y datos</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                        <div className="flex flex-col items-center">
                            <File className="h-6 w-6"/>
                            <span className="text-xs mt-1">Archivo</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <FileText className="h-6 w-6"/>
                            <span className="text-xs mt-1">Documento</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <FilePlus className="h-6 w-6"/>
                            <span className="text-xs mt-1">Nuevo archivo</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Folder className="h-6 w-6"/>
                            <span className="text-xs mt-1">Carpeta</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <FolderPlus className="h-6 w-6"/>
                            <span className="text-xs mt-1">Nueva carpeta</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Save className="h-6 w-6"/>
                            <span className="text-xs mt-1">Guardar</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Database className="h-6 w-6"/>
                            <span className="text-xs mt-1">Base de datos</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <BarChart className="h-6 w-6"/>
                            <span className="text-xs mt-1">Gráfico</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-base font-medium mb-3">Comunicación</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                        <div className="flex flex-col items-center">
                            <MailIcon className="h-6 w-6"/>
                            <span className="text-xs mt-1">Correo</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <MessageSquare className="h-6 w-6"/>
                            <span className="text-xs mt-1">Mensaje</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Phone className="h-6 w-6"/>
                            <span className="text-xs mt-1">Teléfono</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Send className="h-6 w-6"/>
                            <span className="text-xs mt-1">Enviar</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Share className="h-6 w-6"/>
                            <span className="text-xs mt-1">Compartir</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Globe className="h-6 w-6"/>
                            <span className="text-xs mt-1">Web</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Wifi className="h-6 w-6"/>
                            <span className="text-xs mt-1">WiFi</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Bluetooth className="h-6 w-6"/>
                            <span className="text-xs mt-1">Bluetooth</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-base font-medium mb-3">Alertas y feedback</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                        <div className="flex flex-col items-center">
                            <AlertCircle className="h-6 w-6"/>
                            <span className="text-xs mt-1">Alerta</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <AlertTriangle className="h-6 w-6"/>
                            <span className="text-xs mt-1">Advertencia</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <CheckCircle className="h-6 w-6"/>
                            <span className="text-xs mt-1">Éxito</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <XCircle className="h-6 w-6"/>
                            <span className="text-xs mt-1">Error</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Info className="h-6 w-6"/>
                            <span className="text-xs mt-1">Información</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <HelpCircle className="h-6 w-6"/>
                            <span className="text-xs mt-1">Ayuda</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <ThumbsUp className="h-6 w-6"/>
                            <span className="text-xs mt-1">Me gusta</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <ThumbsDown className="h-6 w-6"/>
                            <span className="text-xs mt-1">No me gusta</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-base font-medium mb-3">Dispositivos</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                        <div className="flex flex-col items-center">
                            <Smartphone className="h-6 w-6"/>
                            <span className="text-xs mt-1">Smartphone</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Tablet className="h-6 w-6"/>
                            <span className="text-xs mt-1">Tablet</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Laptop className="h-6 w-6"/>
                            <span className="text-xs mt-1">Laptop</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Monitor className="h-6 w-6"/>
                            <span className="text-xs mt-1">Monitor</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Printer className="h-6 w-6"/>
                            <span className="text-xs mt-1">Impresora</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Camera className="h-6 w-6"/>
                            <span className="text-xs mt-1">Cámara</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Headphones className="h-6 w-6"/>
                            <span className="text-xs mt-1">Auriculares</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Speaker className="h-6 w-6"/>
                            <span className="text-xs mt-1">Altavoz</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-base font-medium mb-3">Seguridad</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                        <div className="flex flex-col items-center">
                            <Lock className="h-6 w-6"/>
                            <span className="text-xs mt-1">Bloquear</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Unlock className="h-6 w-6"/>
                            <span className="text-xs mt-1">Desbloquear</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Shield className="h-6 w-6"/>
                            <span className="text-xs mt-1">Protección</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Key className="h-6 w-6"/>
                            <span className="text-xs mt-1">Clave</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Fingerprint className="h-6 w-6"/>
                            <span className="text-xs mt-1">Huella</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-base font-medium mb-3">Salud</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                        <div className="flex flex-col items-center">
                            <Heart className="h-6 w-6"/>
                            <span className="text-xs mt-1">Corazón</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Activity className="h-6 w-6"/>
                            <span className="text-xs mt-1">Actividad</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Stethoscope className="h-6 w-6"/>
                            <span className="text-xs mt-1">Médico</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Pill className="h-6 w-6"/>
                            <span className="text-xs mt-1">Medicamento</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <FirstAid className="h-6 w-6"/>
                            <span className="text-xs mt-1">Primeros auxilios</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-base font-medium mb-3">Otros</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                        <div className="flex flex-col items-center">
                            <Coffee className="h-6 w-6"/>
                            <span className="text-xs mt-1">Café</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Zap className="h-6 w-6"/>
                            <span className="text-xs mt-1">Energía</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Award className="h-6 w-6"/>
                            <span className="text-xs mt-1">Premio</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Flag className="h-6 w-6"/>
                            <span className="text-xs mt-1">Bandera</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Star className="h-6 w-6"/>
                            <span className="text-xs mt-1">Favorito</span>
                        </div>
                    </div>
                </div>
            </Section>


            {/* Form
            <Section title="Formulario (react-hook-form)" description="Composición de <FormField/> con controles shadcn.">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((v) => alert(JSON.stringify(v, null, 2)))}
                        className="grid gap-4 md:grid-cols-2"
                    >

                        <FormField
                            control={form.control}
                            name="email"
                            rules={{required: "Requerido"}}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="you@example.com" {...field} />
                                    </FormControl>
                                    <FormDescription>No guardamos tu email sin tu permiso.</FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="role"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Rol</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectGroupLabel>General</SelectGroupLabel>
                                                <SelectItem value="viewer">Viewer</SelectItem>
                                                <SelectItem value="editor">Editor</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                                <SelectGroupSeparator/>
                                                <SelectGroupLabel>Especial</SelectGroupLabel>
                                                <SelectItem value="owner">Owner</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>Usa Select para enumeraciones cortas.</FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {/*<FormField
                            control={form.control}
                            name="newsletter"
                            render={({field}) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Newsletter</FormLabel>
                                        <FormDescription>Recibe novedades del producto.</FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange}/>
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className="md:col-span-2 flex gap-2">
                            <Button type="submit">Enviar</Button>
                            <Button type="button" variant="outline" onClick={() => form.reset()}>Reset</Button>
                        </div>
                    </form>
                </Form>
            </Section>*/}

            {/* Choices */}
            <Section title="Checkbox / Radio / Switches" description="Usa RadioGroup para selección única, Checkbox para múltiple.">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Preferencias</Label>
                        <div className="flex items-center gap-2">
                            <Checkbox id="c1"/>
                            <Label htmlFor="c1">Recibir alertas</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox id="c2" defaultChecked/>
                            <Label htmlFor="c2">Modo compacto</Label>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Entrega</Label>
                        <RadioGroup defaultValue="std">
                            <div className="flex items-center gap-2">
                                <RadioGroupItem value="std" id="r1"/>
                                <Label htmlFor="r1">Estándar</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <RadioGroupItem value="exp" id="r2"/>
                                <Label htmlFor="r2">Express</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className="space-y-2 col-span-2">
                        <Label>Switches</Label>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className={"flex items-center gap-2"}>
                                <Switch
                                    id="switch"
                                />
                                <Label htmlFor="switch">Acepto los términos y condiciones</Label>
                            </div>
                            <div className={"flex items-center gap-2"}>
                                <Label className={"hover:bg-accent/50 flex items-center gap-6 rounded-lg border p-3 has-[[aria-checked=true]]:border-primary has-[[aria-checked=true]]:bg-primary/5"}>
                                    <div className={"grid font-normal"}>
                                        <p className={"text-sm leading-none font-medium"}>Habilitar notificaciones</p>
                                        <p className={"text-muted-foreground text-sm"}>Puedes cambiar esta configuración en cualquier momento.</p>
                                    </div>
                                    <Switch
                                        defaultChecked
                                        className={"data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-black"}
                                    />
                                </Label>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Overlays */}
            <Section title="Dialog / AlertDialog / Sheet" description="Patrones de overlay. Usa AlertDialog para confirmaciones.">
                <div className="flex flex-wrap gap-3">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant={"outline"}><SquareArrowOutUpRight/>Abrir diálogo</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Título del diálogo</DialogTitle>
                                <DialogDescription>Contenido descriptivo del diálogo.</DialogDescription>
                            </DialogHeader>
                            <p className="text-sm">Puedes cerrar con el botón o el overlay.</p>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cerrar</Button>
                                </DialogClose>
                                <Button>Guardar</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline"><Trash2/>Eliminar</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>¿Seguro?</AlertDialogTitle>
                                <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <Button variant={"destructive"}>Confirmar</Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline"><PanelRightOpen/>Abrir Sheet</Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Panel lateral</SheetTitle>
                                <SheetDescription>Ideal para ediciones rápidas.</SheetDescription>
                            </SheetHeader>
                            <div className="py-4 space-y-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input id="name" placeholder="Acme"/>
                            </div>
                            <SheetFooter>
                                <Button>Guardar</Button>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </div>
            </Section>

            {/* Toast */}
            <Section title="Toast" description="Mensajes efímeros para notificar acciones al usuario.">
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={() => toast.success("Guardado con éxito")}>
                        <CheckCircle className="h-4 w-4"/>
                        Éxito
                    </Button>

                    <Button variant="outline" onClick={() => toast.error("Ocurrió un error inesperado")}>
                        <AlertTriangle className="h-4 w-4"/>
                        Error
                    </Button>

                    <Button variant="outline" onClick={() => toast.info("Nueva actualización disponible")}>
                        <Info className="h-4 w-4"/>
                        Info
                    </Button>

                    <Button variant="outline" onClick={() => toast.warning("Cuidado con los cambios realizados")}>
                        <AlertCircle className="h-4 w-4"/>
                        Advertencia
                    </Button>
                </div>

                <p className="text-sm text-muted-foreground">
                    Tip: No necesitas configurar nada extra, el <code>{"<Toaster>"}</code> ya está montado en el layout principal.
                </p>
            </Section>


            {/* Menús y popovers */}
            <Section title="Menus, Popovers & Tooltips"
                     description="Usa DropdownMenu para acciones; Popover para contenido liviano; Tooltip para microcopia (requiere TooltipProvider, ya montado en el layout global).">
                <div className="flex flex-wrap gap-4 items-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">Menú</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem>Duplicar</DropdownMenuItem>
                            <DropdownMenuItem>Compartir</DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuRadioGroup value="asc">
                                <DropdownMenuRadioItem value="asc">Asc</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="desc">Desc</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                            <DropdownMenuCheckboxItem checked>
                                Mostrar ocultos
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button>Popover</Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64">Contenido suelto, formularios chicos, etc.</PopoverContent>
                    </Popover>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost">Hover para ver tip</Button>
                        </TooltipTrigger>
                        <TooltipContent>Atajo: ⌘K</TooltipContent>
                    </Tooltip>

                    <HoverCard>
                        <HoverCardTrigger className="underline" asChild>
                            <Button variant="link">Hover para ver más info</Button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-64">
                            Útil para previews de entidades.
                        </HoverCardContent>
                    </HoverCard>
                </div>
            </Section>

            {/* Calendar */}
            <Section title="Calendar" description="Componente controlado/ no controlado para selección de fecha.">
                <Calendar mode="single" className="rounded-md border"/>
            </Section>

            {/* Command */}
            <Section title="Command Palette" description="Busca y ejecuta acciones. Mapea tus comandos a items.">
                <div className="max-w-md rounded-lg border">
                    <Command>
                        <CommandInput placeholder="Buscar comando..."/>
                        <CommandList>
                            <CommandEmpty>Sin resultados.</CommandEmpty>
                            <CommandGroup heading="General">
                                <CommandItem onSelect={() => alert("Nuevo archivo")}>Nuevo archivo <CommandShortcut>⌘N</CommandShortcut></CommandItem>
                                <CommandItem onSelect={() => alert("Guardar")}>Guardar <CommandShortcut>⌘S</CommandShortcut></CommandItem>
                            </CommandGroup>
                            <CommandSeparator/>
                            <CommandGroup heading="Ir a">
                                <CommandItem>Dashboard</CommandItem>
                                <CommandItem>Facturas</CommandItem>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </div>
                <p className="text-sm text-muted-foreground">Tip: expone un atajo global (p. ej., <kbd>⌘K</kbd>) para abrir la paleta.</p>
            </Section>

            {/* Cards, Table, Pagination, Progress */}
            <Section title="Card / Table / Pagination / Progress" description="Layout de datos y navegación.">
                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="rounded-xl">
                        <CardHeader>
                            <CardTitle>Resumen</CardTitle>
                            <CardDescription>KPIs principales</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span>Subida</span>
                                <Badge variant={"outline"}>+12%</Badge>
                            </div>
                            <Progress value={progress} aria-label="Progreso"/>
                            <div className="flex gap-2">
                                <Button onClick={() => setProgress((p) => Math.max(0, p - 10))}>-10</Button>
                                <Button onClick={() => setProgress((p) => Math.min(100, p + 10))}>+10</Button>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="link">Ver detalles</Button>
                        </CardFooter>
                    </Card>

                    <div className="rounded-lg border">
                        <Table>
                            <TableCaption>Top clientes del mes</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Acme</TableCell>
                                    <TableCell>
                                        <Badge variant="green">
                                            Activo
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">$12,300</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Globex</TableCell>
                                    <TableCell>
                                        <Badge variant="gray">
                                            Pendiente
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">$9,870</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Initech</TableCell>
                                    <TableCell>
                                        <Badge variant="red">
                                            Vencido
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">$7,540</TableCell>
                                </TableRow>
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell>Total</TableCell>
                                    <TableCell/>
                                    <TableCell className="text-right">$29,710</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                        <div className="p-3">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious href="#"/>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="#">1</PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="#" isActive>
                                            2
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="#">3</PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationEllipsis/>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationNext href="#"/>
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </div>
                </div>

                {/* Estado vacío */}
                <div className="mt-6 border rounded-lg">
                    <NoDataMessage
                        title="No hay registros disponibles"
                        message="Cuando no existan resultados para mostrar, utiliza este componente para indicar el estado vacío de forma clara y consistente."
                    />
                </div>
            </Section>

            {/* Cargadores */}
            <Section
                title="Cargadores"
                description="Indicadores de carga para estados locales (en línea) y globales (pantalla completa)."
            >
                {/* Loader en línea (local) */}
                <div className="border rounded-lg">
                    <InlineLoader/>
                </div>

                {/* Demo de overlay (global) */}
                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => {
                            setLoading(true);
                            // Demo: oculta el overlay tras 2s
                            setTimeout(() => setLoading(false), 2000);
                        }}
                    >
                        Simular carga global (2s)
                    </Button>
                    <p className="text-sm text-muted-foreground">
                        El overlay bloquea la interacción mientras se completa una acción.
                    </p>
                </div>

                {loading && <FullPageOverlayLoader/>}
            </Section>

            {/* Accordion & Separator */}
            <Section title="Accordion & Separator" description="Para FAQs y divisiones de contenido.">
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="where-components">
                        <AccordionTrigger>¿Dónde encuentro los componentes?</AccordionTrigger>
                        <AccordionContent>
                            Están en <code>components/ui</code>. Cada archivo exporta el componente
                            (por ejemplo, <code>button.tsx</code>, <code>input.tsx</code>).
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="use-in-page">
                        <AccordionTrigger>¿Cómo uso un componente en una página?</AccordionTrigger>
                        <AccordionContent className="space-y-3">
                            <p>Importalo y usalo en tu JSX:</p>
                            <pre className="rounded-md bg-muted p-3 text-sm overflow-x-auto">{`import { Button } from "@/components/ui/button";

export default function Page() {
  return <Button>Guardar</Button>;
}`}</pre>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <Separator/>
                <p className="text-sm text-muted-foreground">Tip: usa Separator para cortar secciones largas.</p>
            </Section>

            {/* Sortable board */}
            <Section title="Tablero de columnas ordenables" description="Componente de tablero con columnas y elementos ordenables mediante drag & drop.">
                <div className={"overflow-hidden overflow-x-auto sm:overflow-x-hidden"}>
                    <div className={"" +
                    "w-[850px] sm:w-[1070px] h-[500px]"
                    }>
                        <SortableBoard
                            onChange={(items: ColumnType[]) => {console.log(items)}}
                            defaultColumns={[
                                {title: "Alertas pendientes", items: ["1"]},
                                {title: "Manejo", items: ["2"]},
                                {title: "Seguimiento", items: ["3"]},
                            ]}
                            renderItem={AlertBoardItem}
                        />
                    </div>
                </div>
            </Section>
        </div>
    );
}

type ColumnType = {
    title: string;
    items: string[];
    id?: string;
};

type TimelineEntry = {
    title: string;
    location: string;
    /** Formato esperado: DD/MM/YYYY HH:mm */
    date: string;
    /** JSX para mostrar badges con tooltips */
    badges: ReactNode;
};

const itemsInfo: Record<string, TimelineEntry> = {
    "1": {
        title: "Carga Solistica Lancaster, Texas",
        location: "Texas, US.",
        date: "01/10/2025 17:58",
        badges: <>
            <Tooltip>
                <TooltipTrigger>
                    <Badge variant="orange">
                        <PackageOpen className="w-4 h-4"/>
                    </Badge>
                </TooltipTrigger>
                <TooltipContent>Paquete abierto</TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger>
                    <Badge variant="red">
                        <Ban className="w-4 h-4"/>
                    </Badge>
                </TooltipTrigger>
                <TooltipContent>Parada no autorizada</TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger>
                    <Badge variant="cyan">
                        <ThermometerSnowflake className="w-4 h-4"/>
                    </Badge>
                </TooltipTrigger>
                <TooltipContent>Cadena de frío interrumpida</TooltipContent>
            </Tooltip>
        </>
    },
    "2": {
        title: "Congelado Villahermosa",
        location: "Veracruz, MEX.",
        date: "05/10/2025 10:14",
        badges: <>
            <Tooltip>
                <TooltipTrigger>
                    <Badge variant="violet">
                        <ClockAlert className="w-4 h-4"/>
                    </Badge>
                </TooltipTrigger>
                <TooltipContent>Retraso en ruta</TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger>
                    <Badge variant="pink">
                        <RouteOff className="w-4 h-4"/>
                    </Badge>
                </TooltipTrigger>
                <TooltipContent>Desvío de ruta</TooltipContent>
            </Tooltip></>
    },
    "3": {
        title: "Reverse Logistics (Inbound)",
        location: "Nevada, US.",
        date: "12/10/2025 09:35",
        badges: <>
            <Tooltip>
                <TooltipTrigger>
                    <Badge variant="teal">
                        <DoorOpen className="w-4 h-4"/>
                    </Badge>
                </TooltipTrigger>
                <TooltipContent>Puerta abierta en tránsito</TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger>
                    <Badge variant="yellow">
                        <BatteryLow className="w-4 h-4"/>
                    </Badge>
                </TooltipTrigger>
                <TooltipContent>Batería baja del dispositivo</TooltipContent>
            </Tooltip>
        </>
    }
}

function AlertBoardItem(id: string) {
    const item = itemsInfo[id]
    if (!item) return null

    return <Card className={"border-none shadow-none text-xs sm:text-sm"}>
        <CardHeader className={"p-2"}>
            <CardTitle className={"flex flex-row gap-2 mb-2"}>
                <Tag className={"h-4 w-4"}/>
                <span>{item.title}</span>
            </CardTitle>
            <CardDescription className={"flex flex-col justify-between gap-2 text-xs sm:text-sm"}>
                <div className={"flex items-center gap-2"}><MapPin className={"w-4 h-4"}/>{item.location}</div>
                <div className={"flex items-center gap-2"}><CalendarIcon className={"w-4 h-4"}/>{item.date}</div>
            </CardDescription>
        </CardHeader>
        <CardContent className={"p-2 flex gap-2 items-start"}>
            {item.badges}
        </CardContent>
    </Card>
}

// DataTable Demo Types
type Shipment = {
    id: string
    tracking: string
    origin: string
    destination: string
    status: "pending" | "in-transit" | "delivered" | "delayed"
    date: string
    amount: number
}

// Sample data
const sampleShipments: Shipment[] = [
    {
        id: "1",
        tracking: "TRX-001-2025",
        origin: "Los Angeles, CA",
        destination: "New York, NY",
        status: "delivered",
        date: "2025-01-15",
        amount: 2450.00
    },
    {
        id: "2",
        tracking: "TRX-002-2025",
        origin: "Chicago, IL",
        destination: "Houston, TX",
        status: "in-transit",
        date: "2025-02-10",
        amount: 1875.50
    },
    {
        id: "3",
        tracking: "TRX-003-2025",
        origin: "Miami, FL",
        destination: "Seattle, WA",
        status: "delayed",
        date: "2025-02-08",
        amount: 3120.75
    },
    {
        id: "4",
        tracking: "TRX-004-2025",
        origin: "Dallas, TX",
        destination: "Phoenix, AZ",
        status: "pending",
        date: "2025-02-16",
        amount: 1650.00
    },
    {
        id: "5",
        tracking: "TRX-005-2025",
        origin: "San Francisco, CA",
        destination: "Denver, CO",
        status: "in-transit",
        date: "2025-02-14",
        amount: 2890.25
    },
    {
        id: "6",
        tracking: "TRX-006-2025",
        origin: "Boston, MA",
        destination: "Atlanta, GA",
        status: "delivered",
        date: "2025-01-28",
        amount: 2100.00
    },
    {
        id: "7",
        tracking: "TRX-007-2025",
        origin: "Portland, OR",
        destination: "Las Vegas, NV",
        status: "in-transit",
        date: "2025-02-15",
        amount: 1540.80
    },
    {
        id: "8",
        tracking: "TRX-008-2025",
        origin: "Philadelphia, PA",
        destination: "San Diego, CA",
        status: "pending",
        date: "2025-02-16",
        amount: 3450.00
    },
]

// DataTable with URL State Demo
function DataTableURLDemo() {
    const [isLoading, setIsLoading] = React.useState(false)
    const [rowSelection, setRowSelection] = React.useState({})

    // Local state for instant input feedback
    const [trackingSearch, setTrackingSearch] = React.useState("")

    // Get Next.js hooks
    const router = useRouter()
    const searchParams = useSearchParams()

    // Use the URL state management hook
    const tableState = useDataTable({
        pageSize: 5, // Smaller page size to demonstrate pagination better
        serverSide: true, // Enable server-side mode for URL sync
        namespace: "shipments", // Namespace to avoid conflicts with other tables
        router,
        searchParams,
    })

    // Sync local tracking search with table filter value on mount/URL change
    React.useEffect(() => {
        const currentFilter = tableState.columnFilters.find(f => f.id === "tracking")
        setTrackingSearch((currentFilter?.value as string) ?? "")
    }, [searchParams])

    // Debounced callback to update actual filter state
    const debouncedSetTrackingFilter = useDebouncedCallback((value: string) => {
        tableState.setColumnFilters((prev) => {
            const withoutTracking = prev.filter(f => f.id !== "tracking")
            if (value) {
                return [...withoutTracking, { id: "tracking", value }]
            }
            return withoutTracking
        })
    }, 300)

    // SERVER-SIDE SIMULATION: Filter, sort, and paginate data
    // In production, this would be done by your API based on URL params
    const processedData = React.useMemo(() => {
        let filtered = [...sampleShipments]

        // Apply filters
        tableState.columnFilters.forEach((filter) => {
            const value = String(filter.value).toLowerCase()
            filtered = filtered.filter((row) => {
                const cellValue = String(row[filter.id as keyof Shipment]).toLowerCase()
                return cellValue.includes(value)
            })
        })

        // Apply sorting
        if (tableState.sorting.length > 0) {
            const sort = tableState.sorting[0]!
            filtered.sort((a, b) => {
                const aVal = a[sort.id as keyof Shipment]
                const bVal = b[sort.id as keyof Shipment]
                if (aVal < bVal) return sort.desc ? 1 : -1
                if (aVal > bVal) return sort.desc ? -1 : 1
                return 0
            })
        }

        // Calculate pagination
        const totalCount = filtered.length
        const pageCount = Math.ceil(totalCount / tableState.pagination.pageSize)
        const start = tableState.pagination.pageIndex * tableState.pagination.pageSize
        const end = start + tableState.pagination.pageSize
        const pageData = filtered.slice(start, end)

        return { data: pageData, totalCount, pageCount }
    }, [tableState.columnFilters, tableState.sorting, tableState.pagination])

    // Column definitions (reusing same columns from above, but simplified)
    const columns: ColumnDef<Shipment>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "tracking",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Tracking #" />
            ),
            cell: ({ row }) => (
                <div className="font-mono text-sm">{row.getValue("tracking")}</div>
            ),
        },
        {
            accessorKey: "origin",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Origin" />
            ),
        },
        {
            accessorKey: "destination",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Destination" />
            ),
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Status" />
            ),
            cell: ({ row }) => {
                const status = row.getValue("status") as string
                const variants: Record<string, "green" | "yellow" | "red" | "gray"> = {
                    delivered: "green",
                    "in-transit": "yellow",
                    delayed: "red",
                    pending: "gray",
                }
                const labels: Record<string, string> = {
                    delivered: "Delivered",
                    "in-transit": "In Transit",
                    delayed: "Delayed",
                    pending: "Pending",
                }
                return <Badge variant={variants[status]}>{labels[status]}</Badge>
            },
        },
        {
            accessorKey: "amount",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Amount" />
            ),
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("amount"))
                const formatted = new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                }).format(amount)
                return <div className="font-medium">{formatted}</div>
            },
        },
        {
            id: "actions",
            header: () => <span className="sr-only">Actions</span>,
            cell: ({ row }) => {
                const shipment = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => {
                                    navigator.clipboard.writeText(shipment.tracking)
                                    toast.success("Tracking number copied!")
                                }}
                            >
                                <Copy className="mr-2 h-4 w-4" />
                                Copy tracking #
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
            enableSorting: false,
            enableHiding: false,
        },
    ]

    // Create table instance with SERVER-SIDE mode
    // Data is already filtered/sorted/paginated, table just displays it
    const table = useReactTable({
        data: processedData.data, // Pre-processed data from "server"
        columns,
        pageCount: processedData.pageCount, // Total pages from "server"
        state: {
            pagination: tableState.pagination,
            sorting: tableState.sorting,
            columnFilters: tableState.columnFilters,
            columnVisibility: tableState.columnVisibility,
            rowSelection,
        },
        enableRowSelection: true,
        onPaginationChange: tableState.setPagination,
        onSortingChange: tableState.setSorting,
        onColumnFiltersChange: tableState.setColumnFilters,
        onColumnVisibilityChange: tableState.setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        // Server-side mode: data is pre-processed, table just displays it
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
    })

    return (
        <div className="space-y-4">
            {/* Demo controls */}
            <div className="flex flex-wrap items-center gap-2 rounded-lg border p-4 bg-muted/20">
                <Label className="text-sm font-medium">Demo controls:</Label>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                        setIsLoading(true)
                        setTimeout(() => setIsLoading(false), 2000)
                    }}
                >
                    {isLoading && <InlineLoader />}
                    {!isLoading && "Simulate loading"}
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                        // Reset to defaults
                        tableState.setPagination({ pageIndex: 0, pageSize: 5 })
                        tableState.setSorting([])
                        tableState.setColumnFilters([])
                    }}
                >
                    Reset URL state
                </Button>
            </div>

            {/* DataTable with URL state */}
            <div className="space-y-4">
                <DataTableToolbar>
                    <div className="flex flex-1 flex-wrap items-center gap-2">
                        <Input
                            placeholder="Search tracking..."
                            value={trackingSearch}
                            onChange={(event) => {
                                const value = event.target.value
                                setTrackingSearch(value) // Instant local update
                                debouncedSetTrackingFilter(value) // Debounced filter update
                            }}
                            className="h-8 w-[200px]"
                        />
                        <Select
                            value={tableState.columnFilters.find(f => f.id === "status")?.value as string ?? "all"}
                            onValueChange={(value) => {
                                tableState.setColumnFilters((prev) => {
                                    const withoutStatus = prev.filter(f => f.id !== "status")
                                    if (value === "all") {
                                        return withoutStatus
                                    }
                                    return [...withoutStatus, { id: "status", value }]
                                })
                            }}
                        >
                            <SelectTrigger className="h-8 w-[150px]">
                                <SelectValue placeholder="Filter status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All statuses</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in-transit">In Transit</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="delayed">Delayed</SelectItem>
                            </SelectContent>
                        </Select>
                        {tableState.columnFilters.length > 0 && (
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setTrackingSearch("")
                                    tableState.setColumnFilters([])
                                }}
                                className="h-8 px-2 lg:px-3"
                            >
                                Clear filters
                                <X className="ml-2 h-4 w-4" />
                            </Button>
                        )}
                    </div>
                    <DataTableViewOptions table={table} />
                </DataTableToolbar>

                <DataTable
                    columns={columns}
                    data={processedData.data} // Pre-filtered/sorted/paginated data from server
                    pageCount={processedData.pageCount} // Total page count from server
                    enableRowSelection
                    enableColumnReordering
                    isLoading={isLoading}
                    // Pass URL state to DataTable
                    pagination={tableState.pagination}
                    onPaginationChange={tableState.setPagination}
                    sorting={tableState.sorting}
                    onSortingChange={tableState.setSorting}
                    columnFilters={tableState.columnFilters}
                    onColumnFiltersChange={tableState.setColumnFilters}
                    columnVisibility={tableState.columnVisibility}
                    onColumnVisibilityChange={tableState.setColumnVisibility}
                    columnOrder={tableState.columnOrder}
                    onColumnOrderChange={tableState.setColumnOrder}
                    rowSelection={rowSelection}
                    onRowSelectionChange={setRowSelection}
                />

                <DataTablePagination table={table} />
            </div>
        </div>
    )
}

// Invoice type from API
type Invoice = {
    id: string
    folio: string
    client_name: string
    issueDate: string
    dueDate: string
    totals: {
        subtotal: number
        iva: number
        total: number
    }
    currency: string
    status: string
}

// Real API DataTable Demo
function DataTableAPIDemo() {
    const [data, setData] = React.useState<Invoice[]>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [pageCount, setPageCount] = React.useState(0)
    const [rowSelection, setRowSelection] = React.useState({})
    const abortControllerRef = React.useRef<AbortController | null>(null)

    const router = useRouter()
    const searchParams = useSearchParams()

    const tableState = useDataTable({
        pageSize: 10,
        serverSide: true,
        namespace: "invoices",
        router,
        searchParams,
    })

    // Fetch data from API based on table state
    // Use stringified versions for stable dependencies
    const paginationKey = JSON.stringify(tableState.pagination)
    const sortingKey = JSON.stringify(tableState.sorting)
    const filtersKey = JSON.stringify(tableState.columnFilters)

    React.useEffect(() => {
        const fetchData = async () => {
            // Cancel previous request if still pending
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }

            // Create new abort controller for this request
            abortControllerRef.current = new AbortController()

            setIsLoading(true)
            try {
                // Build query params from table state
                const params = new URLSearchParams()
                params.set("page", String(tableState.pagination.pageIndex + 1))
                params.set("limit", String(tableState.pagination.pageSize))

                // Add sorting
                if (tableState.sorting.length > 0) {
                    const sort = tableState.sorting[0]!
                    params.set("sortBy", sort.id)
                    params.set("order", sort.desc ? "desc" : "asc")
                }

                // Add filters
                tableState.columnFilters.forEach((filter) => {
                    params.set(filter.id, String(filter.value))
                })

                const response = await fetch(
                    `https://684c5a4aed2578be881e9033.mockapi.io/api/v0/invoices?${params}`,
                    { signal: abortControllerRef.current.signal }
                )

                // Check if response is OK
                if (!response.ok) {
                    const text = await response.text()

                    // Handle rate limiting
                    if (text.includes("rate limit") || response.status === 429) {
                        toast.error("Rate Limit Reached - The API is being called too frequently. Please wait a moment.")
                        throw new Error(`Rate limit exceeded: ${text}`)
                    }

                    throw new Error(`API error: ${response.status} - ${text}`)
                }

                // Check if response is JSON
                const contentType = response.headers.get("content-type")
                if (!contentType || !contentType.includes("application/json")) {
                    const text = await response.text()
                    throw new Error(`Expected JSON but got: ${text}`)
                }

                const result = await response.json()

                setData(result)
                // MockAPI doesn't return total count, so estimate from data length
                const estimatedTotal = result.length < tableState.pagination.pageSize
                    ? tableState.pagination.pageIndex * tableState.pagination.pageSize + result.length
                    : (tableState.pagination.pageIndex + 2) * tableState.pagination.pageSize
                setPageCount(Math.ceil(estimatedTotal / tableState.pagination.pageSize))
            } catch (error) {
                // Ignore abort errors (they're expected when canceling requests)
                if (error instanceof Error && error.name === "AbortError") {
                    return
                }

                console.error("Failed to fetch invoices:", error)
                setData([])
                setPageCount(0)

                // Show error toast if not already shown
                if (!(error instanceof Error && error.message.includes("Rate limit"))) {
                    toast.error("Failed to load invoices. Please try again later.")
                }
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()

        // Cleanup function - abort request if component unmounts or dependencies change
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
        }
    }, [paginationKey, sortingKey, filtersKey])

    const columns: ColumnDef<Invoice>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "folio",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Folio" />
            ),
            cell: ({ row }) => <div className="font-mono text-sm">{row.getValue("folio")}</div>,
        },
        {
            accessorKey: "client_name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Cliente" />
            ),
        },
        {
            accessorKey: "issueDate",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Fecha" />
            ),
            cell: ({ row }) => new Date(row.getValue("issueDate")).toLocaleDateString(),
        },
        {
            accessorKey: "totals.total",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Total" />
            ),
            cell: ({ row }) => {
                const amount = row.original.totals?.total || 0
                const currency = row.original.currency
                return (
                    <div className="font-medium">
                        {new Intl.NumberFormat("es-MX", {
                            style: "currency",
                            currency: currency || "MXN",
                        }).format(amount)}
                    </div>
                )
            },
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Estado" />
            ),
            cell: ({ row }) => {
                const status = row.getValue("status") as string
                const variants: Record<string, "green" | "yellow" | "red" | "gray"> = {
                    paid: "green",
                    pending: "yellow",
                    overdue: "red",
                    cancelled: "gray",
                }
                const labels: Record<string, string> = {
                    paid: "Pagado",
                    pending: "Pendiente",
                    overdue: "Vencido",
                    cancelled: "Cancelado",
                }
                return <Badge variant={variants[status] || "gray"}>{labels[status] || status}</Badge>
            },
        },
    ]

    const table = useReactTable({
        data,
        columns,
        pageCount,
        state: {
            pagination: tableState.pagination,
            sorting: tableState.sorting,
            columnFilters: tableState.columnFilters,
            columnVisibility: tableState.columnVisibility,
            rowSelection,
        },
        enableRowSelection: true,
        onPaginationChange: tableState.setPagination,
        onSortingChange: tableState.setSorting,
        onColumnFiltersChange: tableState.setColumnFilters,
        onColumnVisibilityChange: tableState.setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        // Server-side mode: data comes from API pre-processed
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
    })

    return (
        <div className="space-y-4">
            <DataTable
                columns={columns}
                data={data}
                pageCount={pageCount}
                enableRowSelection
                enableColumnReordering
                isLoading={isLoading}
                pagination={tableState.pagination}
                onPaginationChange={tableState.setPagination}
                sorting={tableState.sorting}
                onSortingChange={tableState.setSorting}
                columnFilters={tableState.columnFilters}
                onColumnFiltersChange={tableState.setColumnFilters}
                columnVisibility={tableState.columnVisibility}
                onColumnVisibilityChange={tableState.setColumnVisibility}
                columnOrder={tableState.columnOrder}
                onColumnOrderChange={tableState.setColumnOrder}
                rowSelection={rowSelection}
                onRowSelectionChange={setRowSelection}
            />
            <DataTablePagination table={table} />
        </div>
    )
}


function MyDataTableExample(){

}
