import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const pageStyles = `
  * { box-sizing: border-box; }
  .background-decor {
      position: absolute;
      border-radius: 50%;
      filter: blur(120px);
      z-index: 1;
      opacity: 0.35;
      pointer-events: none;
  }
  .blur-circle-1 {
      width: 450px;
      height: 450px;
      background: #2563eb;
      top: -100px;
      left: -100px;
      animation: float1 20s infinite ease-in-out alternate;
  }
  .blur-circle-2 {
      width: 550px;
      height: 550px;
      background: #7c3aed;
      bottom: -150px;
      right: -150px;
      animation: float2 25s infinite ease-in-out alternate;
  }
  @keyframes float1 {
      0% { transform: translate(0, 0) scale(1); }
      100% { transform: translate(100px, 80px) scale(1.15); }
  }
  @keyframes float2 {
      0% { transform: translate(0, 0) scale(1.15); }
      100% { transform: translate(-90px, -70px) scale(0.9); }
  }
  .thank-box {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(25px);
      -webkit-backdrop-filter: blur(25px);
      padding: 55px 45px;
      border-radius: 32px;
      text-align: center;
      width: 560px;
      max-width: 92%;
      max-height: 92vh;
      overflow-y: auto;
      z-index: 10;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 35px 80px rgba(0, 0, 0, 0.5),
                  inset 0 1px 0 rgba(255, 255, 255, 0.15);
      animation: slideUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .check-wrapper {
      position: relative;
      width: 96px;
      height: 96px;
      margin: 0 auto 30px;
  }
  .check-glow {
      position: absolute;
      top: -8px; left: -8px; width: 112px; height: 112px;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0) 70%);
      animation: pulseGlow 2.5s infinite ease-in-out;
  }
  .check {
      width: 96px;
      height: 96px;
      background: linear-gradient(135deg, #10b981, #059669);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      font-size: 42px;
      box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
      animation: pop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }
  @keyframes pulseGlow {
      0%, 100% { transform: scale(1); opacity: 0.5; }
      50% { transform: scale(1.25); opacity: 0.9; }
  }
  h2 {
      color: #ffffff;
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 12px 0;
      letter-spacing: -0.5px;
      line-height: 1.3;
  }
  h2 span {
      background: linear-gradient(135deg, #60a5fa, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
  }
  p.subtitle {
      color: #94a3b8;
      font-size: 16px;
      line-height: 1.6;
      margin: 0 0 35px 0;
  }
  .timeline-title {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #64748b;
      margin-bottom: 20px;
  }
  .timeline {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      margin: 25px 0 45px;
      padding: 0 10px;
  }
  .timeline::before {
      content: '';
      position: absolute;
      top: 16px;
      left: 25px;
      right: 25px;
      height: 2px;
      background: rgba(255, 255, 255, 0.08);
      z-index: 1;
  }
  .timeline-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 2;
      flex: 1;
  }
  .timeline-dot {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #1e293b;
      border: 2px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: center;
      align-items: center;
      color: #64748b;
      font-size: 13px;
      font-weight: 700;
      transition: all 0.4s ease;
  }
  .timeline-label {
      font-size: 11px;
      color: #64748b;
      margin-top: 8px;
      font-weight: 500;
      white-space: nowrap;
  }
  .timeline-item.active .timeline-dot {
      background: #2563eb;
      border-color: #2563eb;
      color: white;
      box-shadow: 0 0 15px rgba(37, 99, 235, 0.4);
  }
  .timeline-item.active:nth-child(1) .timeline-dot {
      background: #10b981;
      border-color: #10b981;
      box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
  }
  .timeline-item.active .timeline-label {
      color: #e2e8f0;
  }
  .back-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 14px 36px;
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: white;
      text-decoration: none;
      border-radius: 50px;
      font-weight: 600;
      font-size: 15px;
      box-shadow: 0 10px 25px rgba(37, 99, 235, 0.35);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(255, 255, 255, 0.08);
      width: 100%;
      cursor: pointer;
  }
  .back-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 30px rgba(37, 99, 235, 0.5);
      background: linear-gradient(135deg, #3b82f6, #2563eb);
  }
  .back-btn svg {
      transition: transform 0.3s ease;
  }
  .back-btn:hover svg {
      transform: translateX(-4px);
  }
  @keyframes pop {
      from { transform: scale(0); }
      to { transform: scale(1); }
  }
  @keyframes slideUp {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
  }
  .eligibility-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 20px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.3px;
      margin: 4px 0 22px 0;
  }
  .eligibility-badge.eligible {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.35);
  }
  .eligibility-badge.ineligible {
      background: rgba(239, 68, 68, 0.15);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.35);
  }
  .info-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 18px;
      margin-bottom: 20px;
      text-align: left;
  }
  .info-card-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      color: #64748b;
      margin-bottom: 14px;
  }
  .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px 16px;
  }
  .info-item-label {
      font-size: 11px;
      color: #64748b;
      margin-bottom: 3px;
      font-weight: 500;
  }
  .info-item-value {
      font-size: 14px;
      color: #f1f5f9;
      font-weight: 600;
      word-break: break-word;
  }
  .gpa-row {
      display: flex;
      gap: 10px;
      margin-top: 4px;
  }
  .gpa-pill {
      flex: 1;
      background: rgba(96, 165, 250, 0.1);
      border: 1px solid rgba(96, 165, 250, 0.25);
      border-radius: 12px;
      padding: 12px;
      text-align: center;
  }
  .gpa-pill .val {
      font-size: 20px;
      font-weight: 800;
      color: #60a5fa;
  }
  .gpa-pill .lbl {
      font-size: 10px;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 2px;
  }
  .criteria-card {
      background: rgba(239, 68, 68, 0.08);
      border: 1px solid rgba(239, 68, 68, 0.25);
      border-radius: 16px;
      padding: 18px;
      margin-bottom: 20px;
      text-align: left;
  }
  .criteria-card ul {
      margin: 8px 0 0 0;
      padding-left: 18px;
      color: #fca5a5;
      font-size: 12.5px;
      line-height: 1.7;
  }
  @media (max-width: 480px) {
      .info-grid { grid-template-columns: 1fr; }
      .thank-box { padding: 40px 24px; }
  }
`;

// Shared page shell: animated background + glassmorphism card
function ThankYouShell({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #090d16, #0f172a, #1a1b3a)', fontFamily: "'Outfit', sans-serif", overflow: 'hidden', position: 'relative', margin: 0, width: '100vw' }}>
      <style>{pageStyles}</style>
      <div className='background-decor blur-circle-1'></div>
      <div className='background-decor blur-circle-2'></div>
      <div className='thank-box'>{children}</div>
    </div>
  );
}

// Shown after a successful callback + eligibility submission
function BackToHomeButton() {
  return (
    <Link to='/' className='back-btn'>
      <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
        <line x1='19' y1='12' x2='5' y2='12'></line>
        <polyline points='12 19 5 12 12 5'></polyline>
      </svg>
      Go Back to Home
    </Link>
  );
}

function NextStepsTimeline() {
  return (
    
    <>
    
      <div className='timeline-title'>What happens next</div>
      <div className='timeline'>
        <div className='timeline-item active'>
          <span className='timeline-dot'>1</span>
          <span className='timeline-label'>Request Sent</span>
        </div>
        <div className='timeline-item active'>
          <span className='timeline-dot'>2</span>
          <span className='timeline-label'>Advisor Assigned</span>
        </div>
        <div className='timeline-item'>
          <span className='timeline-dot'>3</span>
          <span className='timeline-label'>Free Callback</span>
        </div>
      </div>
    </>
  );
}

// Generic thank-you shown on direct visits / page refresh (no submission data)
function DefaultThankYou() {
  oaiq(
  "measure",
  "lead_created",
  { type: "customer_action" }
);
  return (
    <ThankYouShell>
      <div className='check-wrapper'>
        <div className='check-glow'></div>
        <div className='check'>✓</div>
      </div>

      <h2>Thank You <span>🎉</span></h2>
      <p className='subtitle'>
        Your request has been received. One of our counseling advisors will
        reach out to you shortly. We appreciate you taking the time to connect
        with us.
      </p>

      <NextStepsTimeline />

      <BackToHomeButton />
    </ThankYouShell>
  );
}

function ThankYou() {
  const { state } = useLocation();

  // No submission data in navigation state (e.g. page refresh or direct visit) — show the default thank-you
  if (!state || !state.name) {
    return <DefaultThankYou />;
  }

  const {
    name,
    email = '',
    phone = '',
    location = '',
    neet_score: neetScore = '',
    passing_year: passingYear = '',
    is_eligible: isEligible = false,
    gpa_10: gpa10 = 0,
    gpa_12: gpa12 = 0,
    combined_gpa: combinedGpa = 0,
    pdf_url: pdfUrl = '',
    failed_criteria: failedCriteria = [],
    report_id: reportId = ''
  } = state;

  // Construct absolute download link for the PDF report using the configure base URL
  const absolutePdfUrl = pdfUrl ? (pdfUrl.startsWith('http') ? pdfUrl : `${axios.defaults.baseURL || ''}${pdfUrl}`) : '';

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.oaiq === 'function') {
      window.oaiq('measure', 'lead_created', {
        type: 'customer_action',
        event_id: '6aaa28ea7c7081989add9d2de9a8f7b5'
      });
    }
  }, []);

  return (
    <ThankYouShell>
      <div className='check-wrapper'>
        <div className='check-glow'></div>
        <div className='check'>✓</div>
      </div>

      <h2>Thank You, <span>{name}</span> 🎉</h2>
      <p className='subtitle'>Your counseling request & academic eligibility evaluation have been received.</p>

      <div className={`eligibility-badge ${isEligible ? 'eligible' : 'ineligible'}`}>
        {isEligible ? '✔ Eligible for MBBS Admission' : '✖ Not Currently Eligible'}
      </div>

      {/* Student Submitted Information */}
      <div className='info-card'>
        <div className='info-card-title'>Submitted Information</div>
        <div className='info-grid'>
          {reportId && (
            <div>
              <div className='info-item-label'>Report ID</div>
              <div className='info-item-value'>{reportId}</div>
            </div>
          )}
          {email && (
            <div>
              <div className='info-item-label'>Email</div>
              <div className='info-item-value'>{email}</div>
            </div>
          )}
          {phone && (
            <div>
              <div className='info-item-label'>Phone</div>
              <div className='info-item-value'>{phone}</div>
            </div>
          )}
          {location && (
            <div>
              <div className='info-item-label'>State / Location</div>
              <div className='info-item-value'>{location}</div>
            </div>
          )}
          {neetScore !== '' && (
            <div>
              <div className='info-item-label'>NEET Score</div>
              <div className='info-item-value'>{neetScore}</div>
            </div>
          )}
          {passingYear && (
            <div>
              <div className='info-item-label'>Class 12 Passing Year</div>
              <div className='info-item-value'>{passingYear}</div>
            </div>
          )}
        </div>

        <div className='gpa-row'>
          <div className='gpa-pill'>
            <div className='val'>{Number(gpa10).toFixed(2)}</div>
            <div className='lbl'>Class 10 GPA</div>
          </div>
          <div className='gpa-pill'>
            <div className='val'>{Number(gpa12).toFixed(2)}</div>
            <div className='lbl'>Class 12 GPA</div>
          </div>
          <div className='gpa-pill'>
            <div className='val'>{Number(combinedGpa).toFixed(2)}</div>
            <div className='lbl'>Combined GPA</div>
          </div>
        </div>
      </div>

      {/* Reasons for ineligibility, if any */}
      {!isEligible && failedCriteria.length > 0 && (
        <div className='criteria-card'>
          <div className='info-card-title' style={{ color: '#f87171' }}>Criteria Not Met</div>
          <ul>
            {failedCriteria.map((reason, idx) => (
              <li key={idx}>{reason}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Eligibility Report PDF Download Action */}
      {pdfUrl && (
        <div style={{ margin: '20px 0', padding: '18px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#f8fafc', marginBottom: '12px' }}>
            📄 Official MBBS Admission Eligibility PDF Report
          </div>
          <a href={absolutePdfUrl} download className="back-btn" style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#ffffff', width: '100%', justifyContent: 'center', display: 'inline-flex', border: 'none', fontWeight: '700', boxShadow: '0 8px 20px rgba(37, 99, 235, 0.4)', textDecoration: 'none' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download PDF Report
          </a>
          {email && (
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '10px 0 0 0' }}>
              A copy has also been sent directly to: <strong style={{ color: '#60a5fa' }}>{email}</strong>
            </p>
          )}
        </div>
      )}

      <NextStepsTimeline />

      <BackToHomeButton />
    </ThankYouShell>
  );
}

export default ThankYou;
