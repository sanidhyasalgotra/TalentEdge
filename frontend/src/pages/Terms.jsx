import { LEGAL } from '../lib/legal'
import { LegalLayout, List, Sec } from '../components/LegalLayout'

export default function Terms() {
  return (
    <LegalLayout title="Terms of Service">
      <Sec title="1. Agreement">
        <p>
          These terms govern your use of TalentEdge, operated by {LEGAL.operator}. By creating an account or using the
          service you agree to them and to our Privacy Policy. If you do not agree, please do not use the service.
        </p>
      </Sec>

      <Sec title="2. The service">
        <p>
          TalentEdge uses artificial intelligence to review resumes and suggest improvements, including an ATS score, keyword analysis,
          bullet rewrites and, when you provide a job description, a role match. The results are for information only.
        </p>
      </Sec>

      <Sec title="3. Eligibility and your account">
        <p>
          You must be at least 18 years old. Give accurate information, keep your password secure, and tell us if you think your account
          has been used without permission. You are responsible for activity under your account.
        </p>
      </Sec>

      <Sec title="4. Your content">
        <p>
          You keep ownership of your resume and everything you upload. You confirm that you have the right to upload it, that it is your
          own resume or you have the person’s permission, and that it does not break the law or anyone’s rights. You give us a limited
          permission to read your content, send it to our AI provider, and store the resulting report, solely to provide the service to you.
        </p>
      </Sec>

      <Sec title="5. Acceptable use">
        <p>You agree not to:</p>
        <List items={[
          'upload unlawful, harmful or malicious files, or other people’s personal data without their permission;',
          'try to break, probe, overload or bypass the limits of the service, or access another user’s data;',
          'hide instructions in a document to manipulate the AI or the scores;',
          'use bots, scrapers or other automated means to use the service;',
          'copy, resell, reverse engineer or build a competing service from TalentEdge, except where the law allows.',
        ]} />
      </Sec>

      <Sec title="6. AI results and your responsibility">
        <p>
          AI output can be wrong, incomplete or out of date. ATS scores are our own internal estimates and are not results from any real
          applicant tracking system. We do not guarantee interviews, job offers or any other outcome. The service is not professional career,
          legal or employment advice.
        </p>
        <p>
          Review every suggestion before using it. Never add experience, qualifications or figures that are not true. You are responsible
          for what appears on any resume you send to an employer.
        </p>
      </Sec>

      <Sec title="7. Availability and changes">
        <p>
          We may change, limit or pause features at any time, including how many analyses you can run in an hour. We do not promise the
          service will always be available or error free.
        </p>
      </Sec>

      <Sec title="8. Ending your use">
        <p>
          You can stop using TalentEdge and delete your analyses at any time, or ask us to delete your account. We may suspend or end
          access if you break these terms or put the service or other users at risk.
        </p>
      </Sec>

      <Sec title="9. Our property">
        <p>
          The TalentEdge software, design and branding belong to us or our licensors. These terms do not give you any right to them
          other than using the service. The reports we generate for you are yours to use.
        </p>
      </Sec>

      <Sec title="10. Disclaimers">
        <p>
          To the fullest extent the law allows, the service is provided “as is” and “as available”, without warranties of any kind,
          including accuracy, fitness for a particular purpose and non-infringement.
        </p>
      </Sec>

      <Sec title="11. Limit of liability">
        <p>
          To the fullest extent the law allows, we are not liable for indirect, incidental or consequential losses, such as lost
          opportunities, income or data. Our total liability for any claim is limited to the amount you paid us for the service in the
          twelve months before the claim, which is zero if you use the free service. Nothing in these terms limits liability that cannot
          be limited by law.
        </p>
      </Sec>

      <Sec title="12. Changes to these terms">
        <p>We may update these terms. If you keep using the service after the effective date of a change, you accept the updated terms. For important changes we will tell you in the app or by email.</p>
      </Sec>

      <Sec title="13. Governing law">
        <p>These terms are governed by the laws of {LEGAL.jurisdiction}, and the courts there have jurisdiction over any dispute, unless the law of your country requires otherwise.</p>
      </Sec>

      <Sec title="14. Contact">
        <p>{LEGAL.operator} — {LEGAL.contactEmail}</p>
      </Sec>
    </LegalLayout>
  )
}
