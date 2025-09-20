// Jest tests for generic tools (stubs)
const path = require('path');
const toolNames = [
  'saveContactDetails',
  'saveAddress',
  'bookAppointment',
  'appointmentRemind',
  'appointmentReschedule',
  'appointmentCancel',
  'routeCallToStaff',
  'logCallSummary',
  'faqLookup',
  'addNoteToContact',
  'duplicateCheck',
  'updateContactStatus',
  'saveLeadSource',
  'sendInfoToContact',
  'genericQueryTool',
  'startCallIntent',
  'qualifyLead',
  'transferToHuman',
];

describe('Generic Tool Stubs', () => {
  toolNames.forEach((tool) => {
    it(`${tool} returns not implemented`, async () => {
      const fn = require(path.join('../tools/generic', tool + '.js'));
      const result = await fn({});
      expect(result).toEqual({ ok: false, error: 'Not implemented yet' });
    });
  });
});
