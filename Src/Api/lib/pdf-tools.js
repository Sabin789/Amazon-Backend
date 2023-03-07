
import PdfPrinter from "pdfmake"


export const  getPDFReadableStream=()=>{
    const fonts={
     Helvetica:{
        normal:"Helvetica",
        bold:"Helvetica-Bold",
        italics:"Helvetica-Oblique",
        bolditalics:"Helvetica BoldOblique"

     }
    }
    const printer=new PdfPrinter(fonts)

    const dd = {
        content: [
            'First paragraph',
            'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines',
            "Second"
        ],
        defaultStyle:{
            font:"Helvetica"
        }
        
    }
    const pdfReadableStream=printer.createPdfKitDocument(dd,{})
    pdfReadableStream.end()

    return pdfReadableStream
}