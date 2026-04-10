import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import type { AnalysisResult } from '../types';

export const generateMemo = async (result: AnalysisResult, fileName: string) => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: 'Legal Risk Assessment Memo',
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Date: ', bold: true }),
              new TextRun(new Date().toLocaleDateString()),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Subject: ', bold: true }),
              new TextRun(`Analysis of ${fileName}`),
            ],
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: 'Executive Summary',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            text: result.summary || 'No summary available.',
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: 'Overall Risk Level',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            text: result.riskLevel || 'Unknown',
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: 'Key Risks & Cons',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          ...(result.cons?.map(
            (con) =>
              new Paragraph({
                text: con,
                bullet: { level: 0 },
              })
          ) || []),
          new Paragraph({
            text: 'Strengths & Pros',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          ...(result.pros?.map(
            (pro) =>
              new Paragraph({
                text: pro,
                bullet: { level: 0 },
              })
          ) || []),
          new Paragraph({
            text: 'Recommended Next Steps',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          ...(result.nextSteps?.map(
            (step) =>
              new Paragraph({
                text: step,
                bullet: { level: 0 },
              })
          ) || []),
          ...(result.clauses && result.clauses.length > 0
            ? [
                new Paragraph({
                  text: 'Clause-by-Clause Breakdown',
                  heading: HeadingLevel.HEADING_1,
                  spacing: { before: 600, after: 200 },
                }),
                ...result.clauses.flatMap((clause, index) => [
                  new Paragraph({
                    text: `Clause ${index + 1} (${clause.riskLevel} Risk)`,
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 400, after: 100 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({ text: 'Original Text: ', bold: true }),
                      new TextRun(clause.originalText),
                    ],
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({ text: 'Analysis: ', bold: true }),
                      new TextRun(clause.analysis),
                    ],
                    spacing: { after: 100 },
                  }),
                  ...(clause.suggestedRewrite
                    ? [
                        new Paragraph({
                          children: [
                            new TextRun({ text: 'Suggested Rewrite: ', bold: true }),
                            new TextRun(clause.suggestedRewrite),
                          ],
                          spacing: { after: 200 },
                        }),
                      ]
                    : []),
                ]),
              ]
            : []),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Legal_Memo_${fileName.replace(/\.[^/.]+$/, '')}.docx`);
};
