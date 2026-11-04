
# Aule Engineering — GA4 Analytics Setup & Verification

## Scope and property
- Site: https://auleengineering.com/ and https://www.auleengineering.com/
- Measurement ID: **G-Y0FHXT02K8** (Aule's existing GA4 stream — do not reuse Current & Craft's ID).
- Code: `privacy-analytics.js`, `index.html`, `privacy.html`.
- Only measures public marketing-site interactions; no engineering projects, client files, uploaded plans,
  calculations, phone numbers, email addresses, or contact message contents.
- No advertising cookies or Google Signals in the site tag.
- Website Privacy Notice includes a visitor on/off toggle. A shared first-party preference cookie
  helps keep a browser's opt-out choice between the apex and www hosts.

**These events do not establish client leads or project wins.** They record page interest, clicks,
and attempts to reach contact details.

## Events implemented

| Event name | Meaning | Key event parameters |
|---|---|---|
| `page_view` | Homepage or privacy page load | `site_page`, `page_title` |
| `service_impression` | One of four engineering capabilities is at least 25% visible on the page | `service_name` |
| `tool_impression` | Copestone or StormRoute calculator card is at least 25% visible | `tool_name` |
| `tool_launch_click` | A visitor clicked the link to launch Copestone or StormRoute | `tool_name`, `placement`, `destination_domain` |
| `service_request_click` | Header or hero Request Engineering Services CTA clicked | `placement` |
| `contact_copy_click` | Phone/email copy button clicked | `contact_method` |
| `section_view` | A section is at least 25% visible | `section_name` |
| `navigation_click` | Services, About, Calculators or Contact navigation clicked | `navigation_target` |
| `cta_click` | View Capabilities clicked | `cta_name`, `placement` |
| `scroll_depth` | 25%, 50%, 75%, or 90% of document reached | `scroll_milestone` |

Every event includes a fixed `site_page` label, query-free `page_location`, and a
`page_referrer` reduced to its origin. Tool destination domain is sent without URL path or query.

Services measured: Pool & Spa Engineering; Civil & Site Engineering; Construction Engineering;
Project & Owner Representation.

Sections measured: hero, services, about, process, tools, contact.

**Privacy and interpretation:** Service impressions mean a capability was displayed, not read;
contact-copy events represent button clicks, not verified copies or messages sent;
service-request clicks only scroll to the contact section, not a submitted consultation request;
tool launches are outbound link clicks, not successful load or usage within Copestone/StormRoute.

## Required GA4 setup after publishing

1. Sign in at https://analytics.google.com/ and select Aule Engineering's GA4 property.
2. Go to **Admin → Data display → Custom definitions → Create custom dimension**.
3. For the following, use **Scope: Event** and the exact event parameter names:

| Dimension name | Event parameter |
|---|---|
| Service name | `service_name` |
| Tool name | `tool_name` |
| Placement | `placement` |
| Contact method | `contact_method` |
| Section name | `section_name` |
| Site page | `site_page` |
| Navigation target | `navigation_target` |
| Scroll milestone | `scroll_milestone` |
| CTA name | `cta_name` |
| Destination domain | `destination_domain` |

Custom definitions ordinarily report only after creation/processing; do not expect backfilled
custom dimension values for events collected before definition registration.

4. Check **Admin → Data streams → Web → Enhanced measurement**. Confirm automatic outbound
   click tracking is off unless the `link_url` data it collects is reviewed and the notice
   updated accordingly. The site's own outbound click events only include tool name and domain.
   Standard GA4 `scroll` and the new `scroll_depth` are distinct; avoid adding them together.
   Enhanced Measurement site search could capture query information; review all enabled options.
5. Review configured GA4 retention and regional consent settings. A default-on/opt-out model
   cannot replace prior consent where that is legally required.

## Build reports: what visitors are most interested in

Create an **Explore → Blank → Free form** report with:
- Dimensions: `Event name` + `Service name` or `Tool name`.
- Metric: `Event count`, optionally `Total users`.
- Rows: `Service name` (or `Tool name`).
- Values: `Event count`.
- Filter Event name: `service_impression` to rank service exposure, or
  `tool_launch_click` to rank calculator launch clicks.
- Time range: 30 or 90 days.

Additional useful reports:
- Demand/contact interest: events `service_request_click` and `contact_copy_click`, broken
  down by Placement and Contact method. **Do not label these as submitted leads.**
- Top sections: `section_view` by `section_name`.
- Menu navigation: `navigation_click` by `navigation_target`.
- Scroll progression: `scroll_depth` by `scroll_milestone`.
- Traffic acquisition and engagements: Reports → Acquisition → Traffic acquisition and
  Reports → Engagement. Referrer paths and query parameters are intentionally suppressed.

## Pre-merge / production verification

- [ ] No JavaScript errors on homepage or privacy page.
- [ ] GA4 Realtime/DebugView shows one `page_view` for each page load, correct site page.
- [ ] Scroll each of four service cards into view; each emits one `service_impression` per load.
- [ ] Scroll calculator cards into view; verify impressions.
- [ ] Click Copestone and StormRoute; each emits exactly one `tool_launch_click` with the
      correct tool name; target links are unchanged.
- [ ] Click two Request Engineering Services buttons; confirm distinct header/hero placements.
- [ ] Click contact copy buttons; only `contact_method=phone/email` is reported, not the actual value.
- [ ] Verify menu navigation, View Capabilities and broad scroll milestones.
- [ ] Privacy page → Turn analytics off; reload. Confirm no GA4 script or events are transmitted.
- [ ] Privacy page → Turn analytics on; confirm a page view occurs again.
- [ ] Reconfirm the opt-out on both apex and www hostnames (subject to browser cookie restrictions).
- [ ] Localhost and alternate preview origins never send analytics.
- [ ] Confirm GA4 Enhanced Measurement choices and region-specific consent requirements.

No changes to the two calculators are made here. Direct calculator visits and
successful software loads require separate, privacy-reviewed instrumentation in the apps.

Publishing requires review and merge by the website owner.
