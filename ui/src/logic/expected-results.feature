Feature: Expected results

  The expected results for both a given player score and the player overall are computed correctly

  Scenario: Single expected result for stand threshold
    Given a player hand resolver with a stand threshold of 17
    When getting the expected result of a player score of "17"
    Then the expected result score equals "17"
    And the expected result probability equals "0.14512590450523094"
    And the expected result outcomes equals "win=0.04086641667628575,push=0.021061528158462465,lose=0.08319795967048273"
    And the expected result edge equals "-0.042331542994196975"

  Scenario: Overall expected results for stand threshold
    Given a player hand resolver with a stand threshold of 17
    When getting the overall expected results
    Then the expected result probability equals "0.9999999999999499"
    And the expected result outcomes equals "win=0.4111752082246918,push=0.09835505186252376,lose=0.49046973991273446"
    And the expected result edge equals "-0.05674630158405533"

  Scenario: Single expected result for optimal roi
    Given a player hand resolver for optimal roi
    When getting the expected result of a player score of "15"
    Then the expected result score equals "15"
    And the expected result probability equals "0.12627279484635356"
    And the expected result outcomes equals "win=0.03555751584572714,push=0,lose=0.09071527900062643"
    And the expected result edge equals "-0.055157763154899286"

  Scenario: Overall expected results for optimal roi
    Given a player hand resolver for optimal roi
    When getting the overall expected results
    Then the expected result probability equals "0.9999999999999739"
    And the expected result outcomes equals "win=0.4261609486269914,push=0.08446816123203983,lose=0.48937089014094276"
    And the expected result edge equals "-0.04066171140996397"

  Scenario: Single expected result for optimal roi with doubling
    Given doubling is allowed
    And a player hand resolver for optimal roi
    When getting the expected result of a player score of "12"
    Then the expected result score equals "12"
    And the expected result probability equals "0.008169993882086286"
    And the expected result outcomes equals "win=0.002300611840224632,push=0,lose=0.005869382041861655"
    And the expected result edge equals "-0.007137540403274045"

  Scenario: Overall expected results for optimal roi with doubling
    Given doubling is allowed
    And a player hand resolver for optimal roi
    When getting the overall expected results
    Then the expected result probability equals "0.9999999999999736"
    And the expected result outcomes equals "win=0.4261114967923784,push=0.08310311693853635,lose=0.49078538626905893"
    And the expected result edge equals "-0.031130692205261448"
