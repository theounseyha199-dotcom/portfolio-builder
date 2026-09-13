package com.portfolio.features.resume.service;
import com.portfolio.common.exception.NotFoundException;
import com.portfolio.features.asset.repository.PortfolioAssetRepository;
import com.portfolio.features.asset.storage.StorageService;
import com.portfolio.features.portfolio.service.PortfolioAccessService;
import com.portfolio.features.resume.dto.ResumePreviewResponse;
import com.portfolio.features.resume.extractor.ResumeTextExtractor;
import com.portfolio.features.resume.parser.ResumeParser;
import com.portfolio.features.user.entity.AppUser;
import java.io.InputStream;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @RequiredArgsConstructor
public class ResumeParsingService {
  private final PortfolioAccessService portfolios; private final PortfolioAssetRepository assets; private final StorageService storage; private final ResumeTextExtractor extractor; private final ResumeParser parser;
  @Transactional(readOnly = true) public ResumePreviewResponse parseCurrentResume(AppUser user) {
    var portfolio = portfolios.mine(user);
    var asset = assets.findByPortfolioIdAndAssetType(portfolio.getId(), "RESUME").orElseThrow(() -> new NotFoundException("Resume not found."));
    try (InputStream input = storage.open(asset.getObjectKey())) { return parser.parse(extractor.extract(input)); }
    catch (ResumeParseException | NotFoundException exception) { throw exception; }
    catch (Exception exception) { throw new ResumeParseException("Unable to read resume."); }
  }
}
