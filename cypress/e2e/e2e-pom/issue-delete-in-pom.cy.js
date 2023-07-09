/**
 * This is an example file and approach for POM in Cypress
 */
import IssueModal from "../../pages/IssueModal";

describe('Tests for covering issue deletion functionality with POM approach', () => {
  // Descrbing constant issueTitle to simplify the code      
  const issueTitle = 'This is an issue of type: Task.';
  const issueDetails = '[data-testid="modal:issue-details"]';
beforeEach(() => {
  cy.visit('/');
  cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
      cy.visit(url + '/board');
      //Borard contains Task issue
      cy.contains(issueTitle).click();
      //Asserting that issue detail view modal is visible after clicking
      cy.get(issueDetails).should('be.visible');
      });
  })

  it('Should delete issue successfully', () => {
    // Clicking Delete button with POM approach
    IssueModal.clickDeleteButton();

    // Confirming Deletion with POM approach
    IssueModal.confirmDeletion();

    // Ensuring issueTitle is not visible on board with POM approach
    IssueModal.ensureIssueIsNotVisibleOnBoard(issueTitle);
    });

  it('Should cancel deletion process successfully', () => {
    IssueModal.clickDeleteButton();

    // Canceling deletion with POM approach
    IssueModal.cancelDeletion();

    // Closing detail modal with POM approach
    IssueModal.closeDetailModal();

    // Ensuring Issue (with issueTitle) is visible on Board 
    IssueModal.ensureIssueIsVisibleOnBoard(issueTitle);
  });
});
