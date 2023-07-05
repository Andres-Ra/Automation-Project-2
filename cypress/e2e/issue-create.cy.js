// Importing faker for random data
import { faker } from '@faker-js/faker';

describe('Issue create', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
    //System will already open issue creating modal in beforeEach block  
    cy.visit(url + '/board?modal-issue-create=true');
    });
  });

  it('Should create an issue and validate it successfully', () => {
    //System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      
      //open issue type dropdown and choose Story - comment for Github
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Story"]')
          .trigger('click');
            
      //Type value to description input field
      cy.get('.ql-editor').type('TEST_DESCRIPTION');

      //Type value to title input field
      //Order of filling in the fields is first description, then title on purpose
      //Otherwise filling title first sometimes doesn't work due to web page implementation
      cy.get('input[name="title"]').type('TEST_TITLE');
      
      //Select Lord Gaben from reporter dropdown
      cy.get('[data-testid="select:userIds"]').click();
      cy.get('[data-testid="select-option:Lord Gaben"]').click();

      //Click on button "Create issue"
      cy.get('button[type="submit"]').click();
    });

    //Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');
    
    //Reload the page to be able to see recently created issue
    //Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    //Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
      //Assert that this list contains 5 issues and first element with tag p has specified text
      cy.get('[data-testid="list-issue"]')
          .should('have.length', '5')
          .first()
          .find('p')
          .contains('TEST_TITLE');
      //Assert that correct avatar and type icon are visible
      cy.get('[data-testid="avatar:Lord Gaben"]').should('be.visible');
      cy.get('[data-testid="icon:story"]').should('be.visible');
    });
  });

/*
    Create a new test case for creating a new issue with the following data:
        // Title “Bug”
        // Description “My bug description”
        // issue with type “Bug”
        // priority “Highest”
        // reporter “Pickle Rick”
    Assert that the issue is created and is visible on the board. 
*/

it('Issue creating test - Test 1, title Bug', () => {
  //System finds modal for creating issue and does next steps inside of it
  cy.get('[data-testid="modal:issue-create"]').within(() => {
    
    //open issue type dropdown and choose Bug; Description "My bug description"; Title "Bug"; Priority "Highest"; Reporter "Pickle Rick"
    cy.get('.ql-editor').type('My bug description');
    cy.get('input[name="title"]').type('Bug');
    cy.get('[data-testid="select:reporterId"]').click();
    cy.get('[data-testid="select-option:Pickle Rick"]').click();
    cy.get('[data-testid="form-field:priority"]').click();
    cy.get('[data-testid="select-option:Highest"]').click();

    //Moved selecting type "Bug" to the end, because if it was first the framework didn't register it correctly
    cy.get('[data-testid="select:type"]').click();
    cy.get('[data-testid="select-option:Bug"]').trigger('click');
    cy.get('button[type="submit"]').click();
  });

  //Assert that modal window is closed and successful message is visible
  cy.get('[data-testid="modal:issue-create"]').should('not.exist');
  cy.contains('Issue has been successfully created.').should('be.visible');
  
  //Reload the page to be able to see recently created issue
  //Assert that successful message has dissappeared after the reload
  cy.reload();
  cy.contains('Issue has been successfully created.').should('not.exist');

  //Assert than only one list with name Backlog is visible and do steps inside of it
  cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
    //Assert that this list contains 5 issues and first element with tag p has specified text
    cy.get('[data-testid="list-issue"]')
        .should('have.length', '5')
        .first()
        .find('p')
        .contains('Bug');

    //Assert that correct avatar (Pickle Rick) and type icon (Bug's icon) are visible
    cy.get('[data-testid="avatar:Pickle Rick"]').should('be.visible');
    cy.get('[data-testid="icon:bug"]').should('be.visible'); 
  });
});

/*
2. Test 2: Add a new test case for creating new issue using random data plugin. Work in the same spec file. Do following steps:
Create a new new issue with the following data:
- Use the random data plugin to fill in title (1 word).
- Use the random data plugin for filling in the description (several words).
- issue with type “Task”
- priority “Low”
- reporter “Baby Yoda” 
*/

it.only('Issue creating test - Using faker', () => {
  //Creating faker data constants

  const randomTitle = faker.word.noun(1); //random Title
  const randomDescription = faker.lorem.sentences(1); //random lorem sentence (1)

  //System finds modal for creating issue and does next steps inside of it
  cy.get('[data-testid="modal:issue-create"]').within(() => {
    
    //Description with faker; Title with faker; Priority "Low"; Reporter "Baby Yoda"
    cy.get('.ql-editor').type(randomDescription);
    cy.get('input[name="title"]').type(randomTitle);
    cy.get('[data-testid="select:reporterId"]').click();
    cy.get('[data-testid="select-option:Baby Yoda"]').click();
    cy.get('[data-testid="form-field:priority"]').click();
    cy.get('[data-testid="select-option:Low"]').click();


    //Open issue type and close it from "X" and re-click to select "Task"
    cy.get('[data-testid="select:type"]').click();
    cy.get('[data-testid="icon:close"]').trigger('mouseover').trigger('click');
    cy.get('[data-testid="select-option:Task"]').trigger("click");

    cy.get('button[type="submit"]').click();
  });

  cy.get('[data-testid="modal:issue-create"]').should('not.exist');
  cy.contains('Issue has been successfully created.').should('be.visible');
  
  cy.reload();
  cy.contains('Issue has been successfully created.').should('not.exist');

  //Assert than only one list with name Backlog is visible and do steps inside of it
  cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
    //Assert that this list contains 5 issues and first element with tag p has specified text
    cy.get('[data-testid="list-issue"]')
        .should('have.length', '5')
        .first()
        .find('p')
        .contains(randomTitle);

    //Assert that correct issue type icon is visible
    cy.get('[data-testid="icon:task"]').first().should('be.visible'); 
  });
});



  it('Should validate title is required field if missing', () => {
    //System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      //Try to click create issue button without filling any data
      cy.get('button[type="submit"]').click();

      //Assert that correct error message is visible
      cy.get('[data-testid="form-field:title"]').should('contain', 'This field is required');
    });
  });
});
