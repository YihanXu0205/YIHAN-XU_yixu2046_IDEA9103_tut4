# YIHAN-XU_yixu2046_IDEA9103_tut4
### This is my introduction of functioning prototype^^


# How to interact with the work:
1. **Load page:** after opening the work page, the canvas will automatically load and display the background pattern. The background consists of randomly generated circular patterns.
2. **Mouse interaction:** when the user clicks the mouse on the canvas, a new non-overlapping circle is generated. This new circle selects a random pattern. Multiple non-overlapping circles can be added by repeating a single shot.
3. **Keyboard Interaction:** Pressing the spacebar clears all circular objects on the current canvas, leaving only the background pattern.


# Details of my individual approach to animating the group code
1. **Personal Code:** 
I select 'User Input' interaction to drive my personal code. Specifically, generating and eliminating circles through mouse and keyboard interactions, and creating a dynamic effect by constantly increasing and decreasing the size of the circular objects.

2. **How to animate:**
On my personal animation handler, the size and colour of the circle will be animated as follows:
- On the size of the circle, the size of the circle object will be changed back and forth from 50 to 200 by constantly adjusting this size property in the update method of the Circle class.

- In the draw method of the circle class, each circle object consists of multiple pattern layers, with the colour and fill of each layer changing randomly. Use the lerpColor function to generate gradient colours so that each layer transitions through a range of colours.


3. **Inspiration:**
During week 8, I determined that my animation was inspired by the ['Circus Fireworks Song' clip from Madagascar 3](https://www.youtube.com/watch?v=J06aSFthX1Y). 

In this clip, the animator uses a lot of circles to simulate the effect of fireworks. !['Circus Fireworks Song'clip image]( readmeImages/circus%20firework%20song%20clip.png)  
This clip had such a strong influence on me that I still insisted on simulating the effect in the footage until this final assignment. Each time the mouse is clicked a new circle is generated to simulate the effect of fireworks. 


4. **Technical Explanation of Image Animation:**
- Circle Class:
   - Added the `growing` property to control the animation state of the circle (growing or shrinking).

   - Added the `update` method:
     - If `growing` is true, increase the size of the circle until it exceeds 200, then set `growing` to false.
     - If `growing` is false, decrease the size of the circle until it is smaller than 50, then set `growing` to true.

- Updating and Drawing Circles in the draw Function:
   - In the `draw` function, iterate through the `circles` array and call the `update` method on each `Circle` object to update its size.
  
   - Call the `draw` method to redraw each circle.

- Caching the Background Image:
   - Use `createGraphics` to create an off-screen buffer `bgGraphics` to store the static background image.
  
   - In the `setup` function, call the `drawBackgroundPattern` function to draw the background and store it in `bgGraphics`.
  
   - In the `draw` function, call `image(bgGraphics, 0, 0)` to render the static background, reducing the need to redraw the background and improving performance.

- Interactive Features:
   - Implement mouse click to add new non-overlapping circles.
    
   - Implement clearing all circles when the spacebar is pressed.
    
   - Handle window resize events to adjust the canvas size.

By following these steps and methods, the code achieves dynamic circle animations, along with interactive features.