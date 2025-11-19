const severityLabel = (score) => {
  if (score === null || score === undefined) return "Not Provided";

  if (score <= 30) return "Low";
  if (score <= 70) return "Medium";
  return "High";
};

const fixPath = (p) => {
  if (!p) return p;
  return p.replace(/\\/g, "/");
};

const formatDate = (iso) => {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatReportData = (raw) => {
  return {
    user: {
      name: raw.user.name,
      email: raw.user.email,
      age: raw.user.age,
      gender: raw.user.gender,
      height: raw.user.height,
      weight: raw.user.weight,
      bmi: raw.user.bmi,
      diseaseTags: raw.user.diseaseTags || [],
      dietType: raw.user.dietType,
    },

    summary: {
      avgSeverity30: raw.summary.avgSeverity30,
      maxSeverity: raw.summary.maxSeverity,
      maxSeverityLabel: severityLabel(raw.summary.maxSeverity),
      totalEntries: raw.summary.totalEntries,
      alertCount: raw.summary.alertCount,
    },

    entries: Array.isArray(raw.entries)
      ? raw.entries
          .map((e) => ({
            id: e.id,
            rawDate: e.date || new Date().toISOString(),
            date: e.date ? formatDate(e.date) : "N/A",
            description: e.description || "No description provided",
            severity: e.severity ?? 0,
            severityLabel: severityLabel(e.severity),
            modelResult: e.modelResult || [],
            images: (e.images || []).map(fixPath),
          }))
          .sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate))
      : [],

    alerts: Array.isArray(raw.alerts)
      ? raw.alerts
          .map((a) => ({
            id: a._id,
            rawDate: a.createdAt || new Date().toISOString(),
            date: a.createdAt ? formatDate(a.createdAt) : "N/A",
            severity: a.severityScore ?? 0,
            severityLabel: severityLabel(a.severityScore),
            description: a.textDescription || "No description",
          }))
          .sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate))
      : [],
  };
};
