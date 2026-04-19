import type { Transaction } from "./types";

export const transactions: Transaction[] = [
  {
    id: "tx-1",
    property: "1842 E Camelback Rd, Phoenix AZ",
    side: "List",
    status: "UnderContract",
    checklist: [
      { id: "c1", label: "Listing agreement signed", done: true },
      { id: "c2", label: "Disclosures uploaded", done: true },
      { id: "c3", label: "Inspection response", done: false },
      { id: "c4", label: "Appraisal ordered", done: false },
    ],
  },
  {
    id: "tx-2",
    property: "905 N 2nd St, Tempe AZ",
    side: "Buy",
    status: "Prep",
    checklist: [
      { id: "c1", label: "Pre-approval on file", done: true },
      { id: "c2", label: "Earnest money receipt", done: false },
    ],
  },
  {
    id: "tx-3",
    property: "44 W Portland St, Chandler AZ",
    side: "List",
    status: "Closing",
    checklist: [
      { id: "c1", label: "Title commitment reviewed", done: true },
      { id: "c2", label: "Final walkthrough scheduled", done: true },
      { id: "c3", label: "Wire instructions verified", done: true },
    ],
  },
  {
    id: "tx-4",
    property: "1201 S Rural Rd, Mesa AZ",
    side: "Buy",
    status: "Closed",
    checklist: [
      { id: "c1", label: "Close packet complete", done: true },
      { id: "c2", label: "Keys transferred", done: true },
    ],
  },
  {
    id: "tx-5",
    property: "7712 N Scottsdale Rd, Scottsdale AZ",
    side: "List",
    status: "Prep",
    checklist: [
      { id: "c1", label: "Photography complete", done: true },
      { id: "c2", label: "MLS live", done: false },
    ],
  },
  {
    id: "tx-6",
    property: "3302 W Glendale Ave, Glendale AZ",
    side: "Buy",
    status: "UnderContract",
    checklist: [
      { id: "c1", label: "Inspection completed", done: true },
      { id: "c2", label: "BINSR delivered", done: false },
    ],
  },
  {
    id: "tx-7",
    property: "501 E Roosevelt St, Phoenix AZ",
    side: "List",
    status: "Prep",
    checklist: [
      { id: "c1", label: "Staging consult", done: false },
    ],
  },
  {
    id: "tx-8",
    property: "220 W University Dr, Tempe AZ",
    side: "Buy",
    status: "Closing",
    checklist: [
      { id: "c1", label: "Loan clear to close", done: true },
      { id: "c2", label: "Signing scheduled", done: true },
    ],
  },
];
