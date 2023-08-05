describe('Issue details editing', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
      cy.visit(url + '/board');
      cy.contains('This is an issue of type: Task.').click();
    });
  });

  it('Should update type, status, assignees, reporter, priority successfully', () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:type"]').click('bottomRight');
      cy.get('[data-testid="select-option:Story"]')
          .trigger('mouseover')
          .trigger('click');
      cy.get('[data-testid="select:type"]').should('contain', 'Story');

      cy.get('[data-testid="select:status"]').click('bottomRight');
      cy.get('[data-testid="select-option:Done"]').click();
      cy.get('[data-testid="select:status"]').should('have.text', 'Done');

      cy.get('[data-testid="select:assignees"]').click('bottomRight');
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
      cy.get('[data-testid="select:assignees"]').click('bottomRight');
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="select:assignees"]').should('contain', 'Baby Yoda');
      cy.get('[data-testid="select:assignees"]').should('contain', 'Lord Gaben');

      cy.get('[data-testid="select:reporter"]').click('bottomRight');
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('[data-testid="select:reporter"]').should('have.text', 'Pickle Rick');

      cy.get('[data-testid="select:priority"]').click('bottomRight');
      cy.get('[data-testid="select-option:Medium"]').click();
      cy.get('[data-testid="select:priority"]').should('have.text', 'Medium');
    });
  });

  it('Should update title, description successfully', () => {
    const title = 'TEST_TITLE';
    const description = 'TEST_DESCRIPTION';

    getIssueDetailsModal().within(() => {
      cy.get('textarea[placeholder="Short summary"]')
        .clear()
        .type(title)
        .blur();

      cy.get('.ql-snow')
        .click()
        .should('not.exist');

      cy.get('.ql-editor').clear().type(description);

      cy.contains('button', 'Save')
        .click()
        .should('not.exist');

      cy.get('textarea[placeholder="Short summary"]').should('have.text', title);
      cy.get('.ql-snow').should('have.text', description);
    });
  });

//Bonus 3 - Task 1

describe('Issue Details page - Priority dropdown', () => {
  const expectedLength = 5;
  let priorityOptions = [];
  const selectPriority = '[data-testid="select:priority"]';

  it('Logging values and arrays in priority list', () => {
    // Log the selected value and push it into array
    cy.get(selectPriority).then(($priorityDropdown) => {
      
      const selectedPriority = $priorityDropdown.text().trim();
      priorityOptions.push(selectedPriority);
      cy.log(`Selected value: ${selectedPriority}, Array length: ${priorityOptions.length}`);

      // Open the dropdown list
      cy.get(selectPriority).click();

      // Access the list of all priority options
      cy.get('[data-testid^="select-option"]').each(($option) => {
        const optionText = $option.text().trim();
        priorityOptions.push(optionText);

        // Log added value and length of the array during each iteration
        cy.log(`Option on the list: ${optionText}, Array length: ${priorityOptions.length}`);
      }).then(() => {
        // Assert that the created array has the same length as the predefined number
        expect(priorityOptions.length).to.equal(expectedLength);
      });
    });
  });
});

//Bonus 3 - Task 2

describe('Issue Details Edit Page - Reporters Name', () => {
  const pattern = /^[A-Za-z\s]*$/

  it('Reporters name should consist only characters', () => {
    // Select reporters name and invoke it
    cy.get('[data-testid="select:reporter"]')
      .invoke('text')
      .then((reporterName) => {
      // Assert that invoked reporters name has only characters using regex
      expect(reporterName).to.match(pattern);
    });
  });
});

  const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');
});
