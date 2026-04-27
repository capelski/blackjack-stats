Feature: Expected results

  The expected results for both a given player score and the player overall are computed correctly

  Scenario: Single score expected result
    Given a player hand resolver with a stand threshold of 17
    When getting the expected result of a player score of "17"
    Then the expected result score equals "17"
    And the expected result probability equals "0.14512590450523094"
    And the expected result outcomes equal win="0.04086641667628575", push="0.021061528158462465" and lose ="0.08319795967048273"
    And the expected result edge equals "-0.042331542994196975"

  Scenario: Overall expected results
    Given a player hand resolver with a stand threshold of 17
    When getting the overall expected results
    Then the expected result probability equals "0.9999999999999499"
    And the expected result outcomes equal win="0.4111752082246918", push="0.09835505186252376" and lose ="0.49046973991273446"
    And the expected result edge equals "-0.05674630158405533"
