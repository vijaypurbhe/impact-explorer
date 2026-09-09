export type Risk = "high" | "medium" | "low" | "related";
export type ActionKind = "Update" | "Review" | "Update Tests";

export interface CodeLine {
  n: number;
  text: string;
  changed?: boolean;
}

export interface GraphNode {
  id: string;
  name: string;
  risk: Risk;
  /** percentage coordinates within the graph canvas */
  x: number;
  y: number;
}

export interface ImpactedFile {
  id: string;
  name: string;
  type: string;
  risk: Exclude<Risk, "related">;
  action: ActionKind;
  relation: string;
  requiredUpdates: string[];
  breakpoints: string[];
  coverageGaps: string[];
  refactors: string[];
  assessment: string;
}

export interface Scenario {
  id: string;
  label: string;
  className: string;
  fileName: string;
  changeSummary: string;
  code: CodeLine[];
  scanned: string[];
  nodes: GraphNode[];
  files: ImpactedFile[];
  workbench: {
    summary: string;
    checklist: string[];
    tests: string[];
    prNotes: string;
  };
}

export const scenarios: Scenario[] = [
  {
    id: "order-service",
    label: "OrderService.calculateTotal() updated",
    className: "OrderService",
    fileName: "OrderService.cls",
    changeSummary:
      "Discount handling moved inside calculateTotal(), and the method now returns a rounded Decimal instead of a Double.",
    code: [
      { n: 1, text: "public class OrderService {" },
      { n: 2, text: "  public Decimal calculateTotal(Order o) {", changed: true },
      { n: 3, text: "    Decimal net = lineTotal(o);" },
      { n: 4, text: "    net -= DiscountEngine.apply(o); // moved in", changed: true },
      { n: 5, text: "    return net.setScale(2);", changed: true },
      { n: 6, text: "  }" },
      { n: 7, text: "}" },
    ],
    scanned: [
      "412 Apex classes",
      "38 triggers",
      "126 test classes",
      "19 Lightning pages",
      "metadata & dependency graph",
    ],
    nodes: [
      { id: "order-controller", name: "OrderController", risk: "high", x: 22, y: 14 },
      { id: "payment-service", name: "PaymentService", risk: "medium", x: 79, y: 16 },
      { id: "order-trigger", name: "OrderTrigger", risk: "high", x: 13, y: 55 },
      { id: "order-summary", name: "OrderSummary", risk: "low", x: 86, y: 55 },
      { id: "order-test", name: "OrderTest", risk: "medium", x: 27, y: 88 },
      { id: "order-page", name: "OrderPage", risk: "low", x: 74, y: 89 },
    ],
    files: [
      {
        id: "order-controller",
        name: "OrderController.cls",
        type: "Apex Class",
        risk: "high",
        action: "Update",
        relation: "Calls calculateTotal() in three places and assigns the result to a Double field.",
        requiredUpdates: [
          "Change orderTotal from Double to Decimal to match the new return type",
          "Remove the local discount subtraction now handled inside OrderService",
          "Re-check currency formatting before it is sent to the Lightning page",
        ],
        breakpoints: [
          "Implicit Double to Decimal conversion will fail to compile",
          "Discount would be applied twice if the local call is left in place",
        ],
        coverageGaps: ["No test covers the multi-currency branch of submitOrder()"],
        refactors: ["Extract the three total lookups into a single private helper"],
        assessment:
          "High — this is the primary caller and it holds the double-discount defect risk.",
      },
      {
        id: "order-trigger",
        name: "OrderTrigger.trigger",
        type: "Apex Trigger",
        risk: "high",
        action: "Update",
        relation: "Recalculates totals in before-update and compares against the stored value.",
        requiredUpdates: [
          "Align the comparison with the new 2-decimal rounding",
          "Guard against recursion now that DiscountEngine runs inside the service",
        ],
        breakpoints: ["Rounding drift will mark unchanged orders as modified"],
        coverageGaps: ["Bulk update (200 records) path is untested"],
        refactors: ["Move the recalculation into a handler class"],
        assessment: "High — silently changes data on every order update.",
      },
      {
        id: "payment-service",
        name: "PaymentService.cls",
        type: "Apex Class",
        risk: "medium",
        action: "Review",
        relation: "Consumes the order total when authorising a payment.",
        requiredUpdates: ["Confirm the authorisation amount uses the rounded value"],
        breakpoints: ["Cent-level mismatch between authorisation and capture"],
        coverageGaps: ["Partial payment scenario has no assertion on the amount"],
        refactors: [],
        assessment: "Medium — no compile break, but a money-accuracy risk.",
      },
      {
        id: "order-test",
        name: "OrderTest.cls",
        type: "Test Class",
        risk: "medium",
        action: "Update Tests",
        relation: "Asserts against the old unrounded totals.",
        requiredUpdates: [
          "Update expected values to two decimal places",
          "Add a case covering an order with a stacked discount",
        ],
        breakpoints: ["Five assertions will fail as written"],
        coverageGaps: ["No negative-total case"],
        refactors: ["Use a test data factory instead of inline records"],
        assessment: "Medium — will fail loudly, so it is safe but must be updated.",
      },
      {
        id: "order-summary",
        name: "OrderSummary.cls",
        type: "Apex Class",
        risk: "low",
        action: "Review",
        relation: "Formats totals for reporting only.",
        requiredUpdates: ["Verify report rounding matches the new scale"],
        breakpoints: [],
        coverageGaps: [],
        refactors: [],
        assessment: "Low — read-only presentation of the value.",
      },
      {
        id: "order-page",
        name: "OrderPage.page",
        type: "Lightning Page",
        risk: "low",
        action: "Review",
        relation: "Displays the total returned by OrderController.",
        requiredUpdates: ["Spot-check the displayed total after deployment"],
        breakpoints: [],
        coverageGaps: [],
        refactors: [],
        assessment: "Low — display only.",
      },
    ],
    workbench: {
      summary:
        "A change to OrderService.calculateTotal() affects 6 artifacts across 4 types. Two of them — OrderController and OrderTrigger — carry a real regression risk because discount logic moved and the return type changed from Double to Decimal. Expected effort: about half a day including tests.",
      checklist: [
        "Change OrderController.orderTotal to Decimal",
        "Remove the duplicate discount subtraction in OrderController",
        "Add a recursion guard to OrderTrigger",
        "Update the five failing assertions in OrderTest",
        "Confirm PaymentService authorises the rounded amount",
      ],
      tests: [
        "OrderTest.testStackedDiscount (new)",
        "OrderTriggerTest.testBulkUpdate200 (new)",
        "PaymentServiceTest.testPartialPaymentAmount (extend)",
        "Full regression on the Order namespace",
      ],
      prNotes:
        "Refactor: move discount handling into OrderService.calculateTotal()\n\n- calculateTotal() now returns a Decimal rounded to 2 places\n- DiscountEngine.apply() is called inside the service, not by callers\n\nFollow-on changes: OrderController (type + duplicate discount), OrderTrigger (rounding comparison + recursion guard), OrderTest (assertions).\nRisk: high on OrderController and OrderTrigger. Targeted regression run on the Order namespace before merge.",
    },
  },
  {
    id: "payment-field",
    label: "PaymentService — new required field added",
    className: "PaymentService",
    fileName: "PaymentService.cls",
    changeSummary:
      "A required settlementRef parameter was added to authorise(), and the DTO gained a matching field.",
    code: [
      { n: 1, text: "public class PaymentService {" },
      { n: 2, text: "  public Result authorise(" },
      { n: 3, text: "      Decimal amount," },
      { n: 4, text: "      String settlementRef) {   // new, required", changed: true },
      { n: 5, text: "    validate(settlementRef);", changed: true },
      { n: 6, text: "    return gateway.send(amount, settlementRef);", changed: true },
      { n: 7, text: "  }" },
      { n: 8, text: "}" },
    ],
    scanned: [
      "412 Apex classes",
      "38 triggers",
      "126 test classes",
      "6 integration endpoints",
      "metadata & dependency graph",
    ],
    nodes: [
      { id: "checkout-controller", name: "CheckoutController", risk: "high", x: 20, y: 16 },
      { id: "refund-service", name: "RefundService", risk: "high", x: 80, y: 18 },
      { id: "payment-callout", name: "PaymentCallout", risk: "medium", x: 12, y: 58 },
      { id: "payment-test", name: "PaymentTest", risk: "medium", x: 87, y: 58 },
      { id: "settlement-batch", name: "SettlementBatch", risk: "low", x: 50, y: 92 },
    ],
    files: [
      {
        id: "checkout-controller",
        name: "CheckoutController.cls",
        type: "Apex Class",
        risk: "high",
        action: "Update",
        relation: "Calls authorise() with the old two-argument signature.",
        requiredUpdates: [
          "Pass a settlement reference from the checkout session",
          "Handle the new validation exception in the catch block",
        ],
        breakpoints: ["Compile error on the two-argument call", "Unhandled ValidationException"],
        coverageGaps: ["No test for a missing settlement reference"],
        refactors: ["Build the payment request through a small builder class"],
        assessment: "High — the main checkout path will not compile.",
      },
      {
        id: "refund-service",
        name: "RefundService.cls",
        type: "Apex Class",
        risk: "high",
        action: "Update",
        relation: "Reuses authorise() for reversal authorisations.",
        requiredUpdates: ["Supply the original settlement reference when reversing"],
        breakpoints: ["Refunds would be sent with a null reference and rejected by the gateway"],
        coverageGaps: ["Reversal path has 41% coverage"],
        refactors: [],
        assessment: "High — silent gateway rejections in production.",
      },
      {
        id: "payment-callout",
        name: "PaymentCallout.cls",
        type: "Apex Class",
        risk: "medium",
        action: "Review",
        relation: "Serialises the payment request to the gateway.",
        requiredUpdates: ["Add settlementRef to the outbound JSON contract"],
        breakpoints: ["Gateway schema mismatch if the field is omitted"],
        coverageGaps: ["Mock callout fixture is out of date"],
        refactors: ["Version the request payload"],
        assessment: "Medium — external contract change.",
      },
      {
        id: "payment-test",
        name: "PaymentTest.cls",
        type: "Test Class",
        risk: "medium",
        action: "Update Tests",
        relation: "Builds authorise() calls directly.",
        requiredUpdates: ["Update every call site with a reference", "Add a null-reference case"],
        breakpoints: ["Eleven calls will not compile"],
        coverageGaps: ["No assertion on the gateway payload"],
        refactors: ["Centralise the mock gateway response"],
        assessment: "Medium — mechanical but wide.",
      },
      {
        id: "settlement-batch",
        name: "SettlementBatch.cls",
        type: "Apex Class",
        risk: "low",
        action: "Review",
        relation: "Reads settlement references written by the service.",
        requiredUpdates: ["Confirm the batch matches on the new reference format"],
        breakpoints: [],
        coverageGaps: [],
        refactors: [],
        assessment: "Low — downstream read.",
      },
    ],
    workbench: {
      summary:
        "Adding a required settlementRef to PaymentService.authorise() breaks 2 callers at compile time and changes an outbound gateway contract. 5 artifacts need attention, and the refund path is the highest-risk item because it fails silently rather than loudly.",
      checklist: [
        "Pass a settlement reference from CheckoutController",
        "Supply the original reference in RefundService reversals",
        "Add settlementRef to the PaymentCallout JSON contract",
        "Update eleven call sites in PaymentTest",
        "Refresh the mock gateway fixture",
      ],
      tests: [
        "PaymentTest.testMissingSettlementRef (new)",
        "RefundServiceTest.testReversalCarriesRef (new)",
        "PaymentCalloutTest.testPayloadShape (extend)",
        "Integration smoke test against the gateway sandbox",
      ],
      prNotes:
        "Feature: require a settlement reference on payment authorisation\n\n- authorise() takes settlementRef and validates it\n- The reference is forwarded to the gateway payload\n\nFollow-on changes: CheckoutController, RefundService, PaymentCallout, PaymentTest.\nRisk: high. RefundService fails silently without the reference — verify in the sandbox before merge.",
    },
  },
  {
    id: "account-trigger",
    label: "AccountTrigger refactored to a handler",
    className: "AccountTrigger",
    fileName: "AccountTrigger.trigger",
    changeSummary:
      "Trigger logic was extracted into AccountTriggerHandler, and the before-insert ordering changed.",
    code: [
      { n: 1, text: "trigger AccountTrigger on Account (" },
      { n: 2, text: "    before insert, before update) {" },
      { n: 3, text: "  AccountTriggerHandler h =", changed: true },
      { n: 4, text: "      new AccountTriggerHandler();", changed: true },
      { n: 5, text: "  h.run(Trigger.operationType);   // was inline", changed: true },
      { n: 6, text: "}" },
    ],
    scanned: [
      "412 Apex classes",
      "38 triggers",
      "84 validation rules",
      "126 test classes",
      "metadata & dependency graph",
    ],
    nodes: [
      { id: "account-handler", name: "AccountTriggerHandler", risk: "high", x: 50, y: 12 },
      { id: "territory-service", name: "TerritoryService", risk: "medium", x: 15, y: 42 },
      { id: "account-dedupe", name: "AccountDedupe", risk: "medium", x: 85, y: 42 },
      { id: "account-trigger-test", name: "AccountTriggerTest", risk: "medium", x: 22, y: 85 },
      { id: "account-page", name: "AccountRecordPage", risk: "low", x: 78, y: 85 },
    ],
    files: [
      {
        id: "account-handler",
        name: "AccountTriggerHandler.cls",
        type: "Apex Class",
        risk: "high",
        action: "Update",
        relation: "New class that now owns all trigger behaviour.",
        requiredUpdates: [
          "Preserve the original before-insert ordering",
          "Add a recursion guard shared across operations",
        ],
        breakpoints: ["Reordered logic changes which field wins on conflicting updates"],
        coverageGaps: ["The new class has no dedicated test class yet"],
        refactors: ["Split run() per operation type"],
        assessment: "High — behaviour ordering is the main regression risk.",
      },
      {
        id: "territory-service",
        name: "TerritoryService.cls",
        type: "Apex Class",
        risk: "medium",
        action: "Review",
        relation: "Assigned territories from inside the old inline trigger body.",
        requiredUpdates: ["Confirm assignment still runs before validation rules fire"],
        breakpoints: ["Accounts could save without a territory"],
        coverageGaps: ["No bulk assignment test"],
        refactors: [],
        assessment: "Medium — ordering sensitive.",
      },
      {
        id: "account-dedupe",
        name: "AccountDedupe.cls",
        type: "Apex Class",
        risk: "medium",
        action: "Review",
        relation: "Runs duplicate detection during before-insert.",
        requiredUpdates: ["Verify dedupe still sees the normalised name"],
        breakpoints: ["Duplicates slip through if normalisation now runs later"],
        coverageGaps: ["Only exact-match duplicates are tested"],
        refactors: ["Make the matching key explicit"],
        assessment: "Medium — data quality risk.",
      },
      {
        id: "account-trigger-test",
        name: "AccountTriggerTest.cls",
        type: "Test Class",
        risk: "medium",
        action: "Update Tests",
        relation: "Tests the trigger through direct DML on Account.",
        requiredUpdates: [
          "Add assertions for the new ordering",
          "Add a 200-record bulk case",
        ],
        breakpoints: ["Two ordering assertions become ambiguous"],
        coverageGaps: ["Handler class not covered directly"],
        refactors: ["Test the handler in isolation"],
        assessment: "Medium — needs new cases, not just fixes.",
      },
      {
        id: "account-page",
        name: "AccountRecordPage",
        type: "Lightning Page",
        risk: "low",
        action: "Review",
        relation: "Shows fields populated by the trigger.",
        requiredUpdates: ["Spot-check territory and owner fields after save"],
        breakpoints: [],
        coverageGaps: [],
        refactors: [],
        assessment: "Low — display only.",
      },
    ],
    workbench: {
      summary:
        "Extracting AccountTrigger into a handler touches 5 artifacts. Nothing breaks at compile time, which is exactly why this change is risky: the before-insert ordering shifted, so territory assignment and duplicate detection need targeted verification.",
      checklist: [
        "Preserve before-insert ordering inside AccountTriggerHandler",
        "Add a shared recursion guard",
        "Verify TerritoryService runs before validation rules",
        "Confirm AccountDedupe still sees the normalised name",
        "Add ordering and bulk cases to AccountTriggerTest",
      ],
      tests: [
        "AccountTriggerHandlerTest (new class)",
        "AccountTriggerTest.testBulkInsert200 (new)",
        "AccountDedupeTest.testFuzzyMatch (new)",
        "Regression on Account validation rules",
      ],
      prNotes:
        "Refactor: move AccountTrigger logic into AccountTriggerHandler\n\n- Trigger body reduced to a single handler call\n- Operation routing handled by run(Trigger.operationType)\n\nFollow-on changes: ordering verification in TerritoryService and AccountDedupe, new handler test class, bulk cases in AccountTriggerTest.\nRisk: medium-high. No compile breaks — verify behaviour ordering manually before merge.",
    },
  },
];

export const riskLabel: Record<Risk, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
  related: "Related",
};

export const riskOrder: Record<Risk, number> = {
  high: 0,
  medium: 1,
  low: 2,
  related: 3,
};

export const businessChallenges = [
  {
    title: "A change in one class can affect many dependent classes and components",
  },
  {
    title: "Manual impact analysis is slow and easy to miss, creating regression risk",
  },
  {
    title: "Developers need visibility into technical dependencies before code is promoted",
  },
  {
    title: "Teams need faster, more reliable change assessment across the application landscape",
  },
];

export const engineeringValue = [
  {
    title: "Faster impact analysis for code changes",
    body: "Move from hours to minutes with AI-assisted analysis",
  },
  {
    title: "Better visibility into dependencies and downstream effects",
    body: "See the full picture before code is promoted",
  },
  {
    title: "Reduced missed updates and lower regression risk",
    body: "Proactively identify what needs to change and test",
  },
  {
    title: "Smarter test targeting and release confidence",
    body: "Focus testing on what matters most",
  },
  {
    title: "Improved developer productivity in the IDE",
    body: "Actionable insights where developers already work",
  },
];

export const integrations = [
  { name: "GitHub", sub: "Source Control" },
  { name: "GitLab", sub: "Source Control" },
  { name: "Bitbucket", sub: "Source Control" },
  { name: "Salesforce", sub: "Apex & Metadata" },
  { name: "Jira", sub: "Issues & Work Items" },
  { name: "SonarQube", sub: "Code Quality" },
  { name: "IDE & Plugins", sub: "VS Code, IntelliJ, etc." },
];
