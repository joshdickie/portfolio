import { mdToPdf } from 'md-to-pdf';
import path from 'path';
import fs from 'fs';

async function generateResume() {
  const inputPath = path.resolve('content/pages/resume.md');
  const outputDir = path.resolve('content/resources');
  const outputPath = path.join(outputDir, 'resume.pdf');
  const stylesheetPath = path.resolve('scripts/resume-style.css');
  fs.mkdirSync(outputDir, { recursive: true });

  console.log(`Generating PDF from ${inputPath}...`);

  const pdf = await mdToPdf({ path: inputPath }, {
    dest: outputPath,
    stylesheet: [stylesheetPath],
    pdf_options: {
      format: 'A4',
      margin: {
        top: '0.75in',
        bottom: '0.75in',
        left: '0.75in',
        right: '0.75in'
      },
      printBackground: true
    }
  });

  if (pdf?.content) {
    console.log(`✅ Resume PDF generated: ${outputPath}`);
  } else {
    console.error('❌ Failed to generate resume PDF');
  }
}

generateResume();
