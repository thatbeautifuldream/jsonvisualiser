export const DEMO_JSON = JSON.stringify(
  {
    whatIsJson: {
      name: "JavaScript Object Notation",
      summary:
        "JSON is a lightweight text format for storing and exchanging data. It is easy for people to read and for machines to parse.",
      valueTypes: {
        string: "text in double quotes",
        number: 42,
        boolean: true,
        null: null,
        object: { description: "key/value pairs wrapped in {}" },
        array: ["ordered", "values", "wrapped", "in", "[]"],
      },
    },
    example: {
      source: "https://milindmishra.com",
      person: {
        name: "Milind Kumar Mishra",
        jobTitle: "Product Engineer",
        description:
          "Product engineer building AI-native interfaces, product systems, and tools people return to.",
        worksFor: { name: "Merlin AI", url: "https://www.getmerlin.in" },
        address: {
          locality: "Bengaluru",
          region: "Karnataka",
          country: "India",
        },
        knowsAbout: [
          "Product engineering",
          "AI-native interfaces",
          "Design engineering",
          "React",
          "TypeScript",
          "Motion design",
          "Design systems",
        ],
        languages: [
          { name: "English", code: "en" },
          { name: "Hindi", code: "hi" },
        ],
        alumniOf: [
          {
            name: "Visvesvaraya Technological University",
            department: "Electronics and Communication",
          },
          {
            name: "National Yang Ming Chiao Tung University",
            department: "Computer Software Engineering",
          },
        ],
        profiles: {
          github: "https://github.com/thatbeautifuldream",
          linkedin: "https://www.linkedin.com/in/mishramilind/",
          x: "https://x.com/milindmishra_",
        },
      },
    },
  },
  null,
  2,
);
