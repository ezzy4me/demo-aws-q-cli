# demo-aws-q-cli
**_Deploy mini game to AWS S3 static website hosting using the provided CloudFormation template!_**

A simple web-based Mario-style platformer game built with HTML and JavaScript. This game features a yellow square character that can jump on platforms, collect coins, and defeat enemies.

## Prerequisites

• A modern web browser (Chrome, Firefox, Safari, Edge)
• Basic knowledge of HTML and JavaScript (for development)
• AWS account (for S3 deployment)

## Game Features

• Simple controls using arrow keys
• Platform jumping mechanics
• Coin collection
• Enemy interaction
• Score tracking
• Game over and restart functionality

## How to Play

1. Use the Arrow Left and Arrow Right keys to move the character
2. Press Arrow Up to jump
3. Collect gold coins to increase your score (+10 points each)
4. Jump on enemies to defeat them (+20 points each)
5. Avoid getting hit by enemies from the side
6. If you get hit by an enemy, the game ends
7. Press the "Restart" button to play again

## Project Structure

mario-game/
├── index.html        # Game HTML structure and styling
├── game.js           # Game logic and functionality
└── s3-static-hosting.yaml  # CloudFormation template for S3 deployment


## Local Development

To run the game locally:

1. Clone this repository
2. Navigate to the project directory
3. Open index.html in your web browser

bash
cd /path/to/mario-game
open index.html


## Deployment to AWS S3

You can deploy this game to AWS S3 static website hosting using the provided CloudFormation template.

### Step 1: Create the S3 bucket and configure static website hosting

1. Navigate to the AWS CloudFormation console
2. Create a new stack using the s3-static-hosting.yaml file
3. Enter a globally unique bucket name when prompted
4. Wait for the stack creation to complete

### Step 2: Upload the game files

1. Upload index.html and game.js to your S3 bucket
2. Make sure the files are publicly accessible

bash
aws s3 cp index.html s3://your-bucket-name/ --acl public-read
aws s3 cp game.js s3://your-bucket-name/ --acl public-read


### Step 3: Access your game

Once deployed, your game will be available at:
http://your-bucket-name.s3-website-<region>.amazonaws.com


## Implementation Details

• The game character is a simple yellow square (40px × 40px)
• Platforms are brown with green tops
• Coins are gold circles
• Enemies move back and forth automatically
• The game uses JavaScript intervals for animation and game loop
• Collision detection is implemented for platforms, coins, and enemies

## Customization

You can customize the game by modifying:

• Character appearance in the createPlayerCharacter() function
• Platform positions in the createPlatforms() function
• Coin positions in the createCoins() function
• Enemy behavior in the moveEnemies() function
• Game physics by adjusting jump height and gravity values

## Troubleshooting S3 Deployment

If you encounter an error about ACLs when deploying to S3:
"Bucket cannot have ACLs set with ObjectOwnership's BucketOwnerEnforced setting"


Make sure your S3 bucket has the appropriate Object Ownership settings:
1. Go to the S3 bucket properties
2. Find "Object Ownership" settings
3. Set it to "ACLs enabled" and "Bucket owner preferred" or "Object writer"

## Screenshots

(Screenshots would be included here)

## Future Enhancements

• Add more levels
• Implement power-ups
• Add sound effects
• Create a start screen
• Add mobile touch controls
