import { LEGAL } from '../lib/legal'
import { LegalLayout, List, Sec, Sub } from '../components/LegalLayout'

export default function Privacy() {
  return (
    <LegalLayout title="Privacy Policy">
      <Sec title="1. Introduction">
        <p>
          This Privacy Policy explains how {LEGAL.operator} (“TalentEdge”, “we”, “us” or “our”) collects, uses, shares and protects
          personal information when you use the TalentEdge website and resume analysis service (the “Service”). By using the Service,
          you acknowledge the practices described in this policy. If you do not agree with them, please do not use the Service.
        </p>
      </Sec>

      <Sec title="2. Information We Collect">
        <Sub>Information you provide to us</Sub>
        <List items={[
          'Account information, such as your email address and password.',
          'Profile information that you choose to add, such as your name, job title and phone number.',
          'Resume content, meaning the PDF or DOCX files you upload and the text they contain.',
          'Job-related information you enter, such as a target role, company name and job description.',
          'Messages you send to us, such as support or privacy requests.',
        ]} />
        <Sub>Information from sign-in providers</Sub>
        <p>
          If you choose to sign in with a third-party account such as Google, we receive basic profile information that the provider
          makes available to us, such as your name, email address and profile picture.
        </p>
        <Sub>Information collected automatically</Sub>
        <p>
          When you use the Service, we and our hosting providers automatically record technical information such as your IP address,
          browser type, the pages and features you use, request times and error reports. A sign-in token is also stored in your browser
          so that you remain signed in.
        </p>
      </Sec>

      <Sec title="3. How We Use Your Information">
        <List items={[
          'To create and manage your account and authenticate you.',
          'To analyze your resume and generate scores, feedback and recommendations.',
          'To save your analysis history so that you can review it later.',
          'To protect the Service, including preventing abuse, applying usage limits and diagnosing technical problems.',
          'To communicate with you about the Service and respond to your requests.',
          'To comply with legal obligations and enforce our Terms of Service.',
        ]} />
        <p>
          We do not sell your personal information, and we do not use your resume content to train our own machine-learning models.
        </p>
        <Sub>Legal bases (EEA and UK users)</Sub>
        <p>
          Where the GDPR or UK GDPR applies, we process personal data to perform our contract with you, for our legitimate interests in
          operating and securing the Service, to comply with legal obligations, and on the basis of your consent where required.
        </p>
      </Sec>

      <Sec title="4. Resume Content and AI Processing">
        <p>
          Resume analysis is carried out using artificial intelligence services provided by third-party providers acting on our behalf.
          When you request an analysis, the text extracted from your resume, together with any target role, company and job description
          you provide, is transmitted over an encrypted connection to our AI service provider to generate your report.
        </p>
        <p>
          We do not retain your uploaded file or its full extracted text once processing is complete. We retain the resulting report,
          which may include short excerpts from your resume, such as examples cited as evidence and bullet points suggested for revision.
        </p>
        {LEGAL.geminiPaidTier ? (
          <p>
            Our AI service provider processes this content on our behalf and does not use it to improve or train its own models. Content
            may be logged for a limited period for security, abuse prevention and legal compliance.
          </p>
        ) : (
          <p>
            Our AI service provider may use content submitted for processing to maintain, improve and develop its services, and
            authorized reviewers may access it as part of that process. If you are not comfortable with this, please do not submit your
            resume.
          </p>
        )}
        <p>
          We recommend removing sensitive information that is not needed for the analysis, such as government-issued identification
          numbers, financial account details or health information, before you upload a document.
        </p>
      </Sec>

      <Sec title="5. How We Share Information">
        <p>We share personal information only in the following circumstances:</p>
        <List items={[
          'With service providers that support the Service, such as cloud hosting, authentication and database infrastructure, and AI processing. These providers process information on our behalf and under their own terms and privacy commitments. A list of our service providers is available on request.',
          'To comply with applicable law, legal process or a valid request from a public authority.',
          'To protect the rights, safety and security of our users, the public and the Service.',
          'In connection with a merger, acquisition or sale of assets, in which case we will tell you if your information becomes subject to a different privacy policy.',
          'With your consent or at your direction.',
        ]} />
      </Sec>

      <Sec title="6. Cookies and Similar Technologies">
        <p>
          We use browser storage that is strictly necessary to keep you signed in and to make the Service work. We do not currently use
          advertising cookies or third-party analytics tools. If this changes, we will update this policy and, where required, ask for
          your consent.
        </p>
      </Sec>

      <Sec title="7. Data Retention">
        <p>
          We keep your account information and saved analyses for as long as your account is active or as needed to provide the Service.
          You can delete individual analyses from your history, or all of them from your Account page. To delete your account, contact us
          at {LEGAL.contactEmail}. We will delete or anonymize your personal information within a reasonable period and in any case
          within the time required by law, except where we must retain it to meet legal obligations. Residual copies may remain in backups
          and provider logs for a limited time until they are overwritten.
        </p>
      </Sec>

      <Sec title="8. Security">
        <p>
          We use reasonable technical and organizational measures to protect personal information, including encryption in transit,
          authentication, and database access rules that allow each signed-in user to read only their own saved analyses. No method of
          transmission or storage is completely secure, so we cannot guarantee absolute security. Please choose a strong, unique password
          and keep it confidential.
        </p>
      </Sec>

      <Sec title="9. International Data Transfers">
        <p>
          Our service providers may store and process information in countries other than the one where you live. Those countries may have
          data protection laws that differ from those in your country. By using the Service, you understand that your information may be
          transferred to and processed in such countries.
        </p>
      </Sec>

      <Sec title="10. Your Rights and Choices">
        <p>
          Depending on where you live, you may have the right to access the personal information we hold about you, correct it, delete
          it, receive a copy of it, withdraw consent, object to or restrict certain processing, and lodge a complaint with a data
          protection authority. These rights arise under laws such as India’s Digital Personal Data Protection Act, 2023 and, where
          applicable, the GDPR and UK GDPR.
        </p>
        <p>
          You can update your profile and delete saved analyses from your Account page. To exercise any other right, contact us at{' '}
          {LEGAL.contactEmail}. We may need to verify your identity before acting on a request, and we will respond within the time
          required by applicable law.
        </p>
      </Sec>

      <Sec title="11. Children’s Privacy">
        <p>
          The Service is intended for individuals aged 18 and over and is not directed at children. We do not knowingly collect personal
          information from anyone under 18. If you believe a child has provided us with personal information, please contact us and we
          will delete it.
        </p>
      </Sec>

      <Sec title="12. Changes to This Policy">
        <p>
          We may update this policy from time to time. When we do, we will revise the “Last updated” date at the top of this page and, for
          material changes, provide additional notice through the Service or by email.
        </p>
      </Sec>

      <Sec title="13. Contact Us">
        <p>
          If you have questions about this policy, or a privacy request or complaint, please contact: {LEGAL.operator}, {LEGAL.contactEmail}.
        </p>
      </Sec>
    </LegalLayout>
  )
}
