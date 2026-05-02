Feature: Expected results

  The expected results for both a given player score and the player overall are computed correctly

  Scenario: Stand threshold single expected result
    Given a player hand resolver with a stand threshold of 17
    When getting the expected result of a player score of "17"
    Then the expected result score equals "17"
    And the expected result probability equals "0.14512590450523094"
    And the expected result outcomes equal win="0.04086641667628575", push="0.021061528158462465" and lose ="0.08319795967048273"
    And the expected result edge equals "-0.042331542994196975"

  Scenario: Stand threshold overall expected results
    Given a player hand resolver with a stand threshold of 17
    When getting the overall expected results
    Then the expected result probability equals "0.9999999999999499"
    And the expected result outcomes equal win="0.4111752082246918", push="0.09835505186252376" and lose ="0.49046973991273446"
    And the expected result edge equals "-0.05674630158405533"

  Scenario: Optimal ROI single expected result
    Given a player hand resolver for optimal roi
    When getting the expected result of a player score of "15"
    Then the expected result score equals "15"
    And the expected result probability equals "0.12627279484635356"
    And the expected result outcomes equal win="0.03555751584572714", push="0" and lose ="0.09071527900062643"
    And the expected result edge equals "-0.055157763154899286"

  Scenario: Optimal ROI overall expected results
    Given a player hand resolver for optimal roi
    When getting the overall expected results
    Then the expected result probability equals "0.9999999999999739"
    And the expected result outcomes equal win="0.4261609486269914", push="0.08446816123203983" and lose ="0.48937089014094276"
    And the expected result edge equals "-0.04066171140996397"
