package com.portfolio.features.resume.extractor;
import static org.junit.jupiter.api.Assertions.*;
import com.portfolio.features.resume.service.ResumeParseException;
import java.io.*;
import org.apache.pdfbox.pdmodel.*;
import org.apache.pdfbox.pdmodel.font.PDType1Font; import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.junit.jupiter.api.Test;
class PdfResumeTextExtractorTest {
  private final PdfResumeTextExtractor extractor=new PdfResumeTextExtractor();
  @Test void extractsTextFromValidPdf() throws Exception { assertTrue(extractor.extract(pdf("Ada Resume")).contains("Ada Resume")); }
  @Test void rejectsEmptyPdf() throws Exception { assertThrows(ResumeParseException.class,()->extractor.extract(pdf(""))); }
  @Test void rejectsCorruptPdf() { assertThrows(ResumeParseException.class,()->extractor.extract(new ByteArrayInputStream("not a pdf".getBytes()))); }
  private InputStream pdf(String text) throws Exception { try(PDDocument document=new PDDocument(); ByteArrayOutputStream output=new ByteArrayOutputStream()){document.addPage(new PDPage()); if(!text.isBlank())try(PDPageContentStream content=new PDPageContentStream(document,document.getPage(0))){content.beginText();content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA),12);content.newLineAtOffset(72,720);content.showText(text);content.endText();}document.save(output);return new ByteArrayInputStream(output.toByteArray());} }
}
