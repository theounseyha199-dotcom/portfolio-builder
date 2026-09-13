package com.portfolio.features.resume.extractor;
import com.portfolio.features.resume.service.ResumeParseException;
import java.io.IOException;
import java.io.InputStream;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.encryption.InvalidPasswordException;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Component;

@Component
public class PdfResumeTextExtractor implements ResumeTextExtractor {
  @Override public String extract(InputStream inputStream) {
    try (PDDocument document = Loader.loadPDF(inputStream.readAllBytes())) {
      if (document.isEncrypted()) throw new ResumeParseException("Password-protected resumes are not supported.");
      String text = new PDFTextStripper().getText(document).trim();
      if (text.isBlank()) throw new ResumeParseException("No readable text was found. Scanned resumes are not supported yet.");
      return text;
    } catch (ResumeParseException exception) { throw exception; }
    catch (InvalidPasswordException exception) { throw new ResumeParseException("Password-protected resumes are not supported."); }
    catch (IOException exception) { throw new ResumeParseException("Unable to read resume."); }
  }
}
