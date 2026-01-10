
import { Kalam, Cabin_Sketch } from "next/font/google"; // Using Cabin Sketch as secondary as planned

const kalam = Kalam({ subsets: ["latin"], weight: ["300", "400", "700"] });
// const cabinSketch = Cabin_Sketch({ subsets: ["latin"], weight: ["400", "700"] }); // Optional if we want to use it

export const metadata = { title: "Carta Clásica" };

export default function CartaClasicaLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={kalam.className}>
            {children}
        </div>
    );
}
