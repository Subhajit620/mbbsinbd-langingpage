export const marksToGpa = (marks) => {
  const m = Number(marks) || 0;
  if (m >= 80) return 5.0;
  if (m >= 70) return 4.0;
  if (m >= 60) return 3.5;
  if (m >= 50) return 3.0;
  if (m >= 40) return 2.0;
  if (m >= 25) return 1.0;
  return 0.0;
};

export const calculateLeadMetrics = (leadData) => {
  const m10Raw = leadData.marks_10 || leadData.marks10 || {};
  const m12Raw = leadData.marks_12 || leadData.marks12 || {};

  let m10_1 = 0, m10_2 = 0, m10_3 = 0, m10_4 = 0, m10_5 = 0;
  let sub1Name = 'Subject 1', sub2Name = 'Subject 2', sub3Name = 'Subject 3', sub4Name = 'Subject 4', sub5Name = 'Subject 5';

  if (Array.isArray(m10Raw)) {
    if (m10Raw[0]) { sub1Name = m10Raw[0].subject || m10Raw[0].name || 'Sub1'; m10_1 = Number(m10Raw[0].marks ?? m10Raw[0].mark) || 0; }
    if (m10Raw[1]) { sub2Name = m10Raw[1].subject || m10Raw[1].name || 'Sub2'; m10_2 = Number(m10Raw[1].marks ?? m10Raw[1].mark) || 0; }
    if (m10Raw[2]) { sub3Name = m10Raw[2].subject || m10Raw[2].name || 'Sub3'; m10_3 = Number(m10Raw[2].marks ?? m10Raw[2].mark) || 0; }
    if (m10Raw[3]) { sub4Name = m10Raw[3].subject || m10Raw[3].name || 'Sub4'; m10_4 = Number(m10Raw[3].marks ?? m10Raw[3].mark) || 0; }
    if (m10Raw[4]) { sub5Name = m10Raw[4].subject || m10Raw[4].name || 'Sub5'; m10_5 = Number(m10Raw[4].marks ?? m10Raw[4].mark) || 0; }
  } else if (typeof m10Raw === 'object' && m10Raw !== null) {
    sub1Name = leadData.c10Sub1Name || m10Raw.sub1Name || 'English';
    sub2Name = leadData.c10Sub2Name || m10Raw.sub2Name || 'Mathematics';
    sub3Name = leadData.c10Sub3Name || m10Raw.sub3Name || 'Science';
    sub4Name = leadData.c10Sub4Name || m10Raw.sub4Name || 'Social Science';
    sub5Name = leadData.c10Sub5Name || m10Raw.sub5Name || 'Second Language';

    m10_1 = Number(leadData.c10Sub1Mark ?? m10Raw.sub1Mark ?? m10Raw.phy ?? m10Raw.english) || 0;
    m10_2 = Number(leadData.c10Sub2Mark ?? m10Raw.sub2Mark ?? m10Raw.chem ?? m10Raw.math) || 0;
    m10_3 = Number(leadData.c10Sub3Mark ?? m10Raw.sub3Mark ?? m10Raw.bio ?? m10Raw.science) || 0;
    m10_4 = Number(leadData.c10Sub4Mark ?? m10Raw.sub4Mark ?? m10Raw.math) || 0;
    m10_5 = Number(leadData.c10Sub5Mark ?? m10Raw.sub5Mark ?? m10Raw.eng) || 0;
  }

  // Prioritize exact stored DB calculated_gpa_10 if available
  let sscGpa = 0;
  if (leadData.calculated_gpa_10 !== undefined && leadData.calculated_gpa_10 !== null) {
    sscGpa = Number(leadData.calculated_gpa_10) || 0;
  } else if (leadData.sscGpa !== undefined && leadData.sscGpa !== null) {
    sscGpa = Number(leadData.sscGpa) || 0;
  } else if (m10_1 || m10_2 || m10_3 || m10_4 || m10_5) {
    const g10_1 = marksToGpa(m10_1);
    const g10_2 = marksToGpa(m10_2);
    const g10_3 = marksToGpa(m10_3);
    const g10_4 = marksToGpa(m10_4);
    const g10_5 = marksToGpa(m10_5);
    sscGpa = Number(((g10_1 + g10_2 + g10_3 + g10_4 + g10_5) / 5).toFixed(2));
  }

  // Extract Class 12 Marks
  const m12Phy = Number(leadData.c12Sub1Mark ?? m12Raw.phyMark ?? m12Raw.physics ?? m12Raw.phy) || 0;
  const m12Chem = Number(leadData.c12Sub2Mark ?? m12Raw.chemMark ?? m12Raw.chemistry ?? m12Raw.chem) || 0;
  const m12Bio = Number(leadData.c12Sub3Mark ?? m12Raw.bioMark ?? m12Raw.biology ?? m12Raw.bio) || 0;

  // Prioritize exact stored DB calculated_gpa_12 if available
  let hscGpa = 0;
  if (leadData.calculated_gpa_12 !== undefined && leadData.calculated_gpa_12 !== null) {
    hscGpa = Number(leadData.calculated_gpa_12) || 0;
  } else if (leadData.hscGpa !== undefined && leadData.hscGpa !== null) {
    hscGpa = Number(leadData.hscGpa) || 0;
  } else if (m12Phy || m12Chem || m12Bio) {
    const g12Phy = marksToGpa(m12Phy);
    const g12Chem = marksToGpa(m12Chem);
    const g12Bio = marksToGpa(m12Bio);
    hscGpa = Number(((g12Phy + g12Chem + g12Bio) / 3).toFixed(2));
  }

  const totalGpa = Number((sscGpa + hscGpa).toFixed(2));
  const passYear = String(leadData.passYear ?? leadData.passing_year ?? '').trim();
  const neetScore = Number(leadData.neetScore ?? leadData.neet_score) || 0;

  // Criteria Checks
  const failedCriteria = [];

  if (sscGpa < 3.5) {
    failedCriteria.push(`Class 10 GPA (${sscGpa.toFixed(2)}) is below the required 3.50 minimum.`);
  }

  if (hscGpa < 3.5) {
    failedCriteria.push(`Class 12 GPA (${hscGpa.toFixed(2)}) is below the required 3.50 minimum.`);
  }

  if (totalGpa < 7.0) {
    failedCriteria.push(`Combined GPA (${totalGpa.toFixed(2)}) is below the required 7.00 threshold.`);
  }

  if (m12Bio < 60) {
    failedCriteria.push(`Class 12 Biology score (${m12Bio}%) is below the required 60% threshold.`);
  }

  if (passYear !== '2025' && passYear !== '2026') {
    failedCriteria.push(`Class 12 passing year (${passYear}) does not fall within the eligible window (2025/2026).`);
  }

  if (neetScore < 120) {
    failedCriteria.push(`NEET Score (${neetScore}) does not meet the minimum qualified status (120+).`);
  }

  const isEligible = leadData.is_eligible !== undefined ? Boolean(leadData.is_eligible) : (failedCriteria.length === 0);

  return {
    sscGpa,
    hscGpa,
    totalGpa,
    isEligible,
    failedCriteria,
    marks10Obj: {
      sub1Name, sub1Mark: m10_1,
      sub2Name, sub2Mark: m10_2,
      sub3Name, sub3Mark: m10_3,
      sub4Name, sub4Mark: m10_4,
      sub5Name, sub5Mark: m10_5,
    },
    marks12Obj: {
      phyMark: m12Phy,
      chemMark: m12Chem,
      bioMark: m12Bio,
    }
  };
};

export const generateReportId = () => {
  const chars = '0123456789ABCDEF';
  let randomHex = '';
  for (let i = 0; i < 8; i++) {
    randomHex += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `MBBS-REG-${randomHex}`;
};
