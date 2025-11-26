import {Avatar, AvatarFallback, AvatarImage} from "@traxion-global/design-system";

export default function FacebookHoverCard() {
    return <div className="flex justify-between gap-4">
        <Avatar>
            <AvatarImage src="https://scontent.fmex15-1.fna.fbcdn.net/v/t39.30808-1/443696248_986219976841208_851860423061055465_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=106&ccb=1-7&_nc_sid=2d3e12&_nc_ohc=Rb_LKSqus1YQ7kNvwFBhUI_&_nc_oc=AdnKX0GffrEbDkjiIXX4Qat_VoUyVEfGXJx4mbIZ0x1Kd891Hn7jpnXZlYxok3T3LHle94vU0rFTaukcTyit6Kc2&_nc_zt=24&_nc_ht=scontent.fmex15-1.fna&_nc_gid=e9Wh-xDI9RwIPRILnMrHnA&oh=00_Afe5d253zXxc0MDRUjR1OEsfVAz2ACF-c1jZv_J6Kq1gDg&oe=68EB9302"/>
            <AvatarFallback>TM</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
            <h4 className="text-sm font-semibold">@TraxionMx</h4>
            <p className="text-sm">
                Somos la empresa líder en la industria del autotransporte y logística en México, ofrecemos una solución única e integral de transporte de carga y logística, y servicios de transporte escolar y de personal.
            </p>
            <div className="text-muted-foreground text-xs">
                <a href={"https://www.facebook.com/TraxionMx"} target="_blank" rel="noreferrer" className="inline-flex items-center underline">https://www.facebook.com/TraxionMx</a>
            </div>
        </div>
    </div>
}