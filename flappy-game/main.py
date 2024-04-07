import pygame, sys, random

def draw_floor():
    screen.blit(floor_surface,(floor_x1,550))
    screen.blit(floor_surface,(floor_x2,550))

def create_pipe(pipe_distance):
    if score > 10:
        pipe_distance = 1150
    if score > 25:
        pipe_distance = 1100
    random_pipe_pos = random.choice(pipe_height)
    top_pipe = pipe_surface.get_rect(midtop = (600, random_pipe_pos - pipe_distance))
    bottom_pipe = pipe_surface.get_rect(midbottom = (600, random_pipe_pos))
    return bottom_pipe, top_pipe


def move_pipes(pipes):
    for pipe in pipes:
        pipe.centerx -= 5
    return pipes

def draw_pipes(pipes):
    for pipe in pipes:
        if pipe.bottom >= 500:
            screen.blit(pipe_surface, pipe)
        else: 
            flip_pipe = pygame.transform.flip(pipe_surface,False,True)
            screen.blit(flip_pipe, pipe)
    
def check_collision(pipes):
    for pipe in pipes:
        if bird_rect.colliderect(pipe):
            return False
    if bird_rect.top <= -100 or bird_rect.bottom >= 600:
        return False
    return True

def rotate_bird(bird):
    new_bird = pygame.transform.rotozoom(bird, -bird_movement*3, 1)
    return new_bird

def score_display(game_state):
    if game_state:
        score_surface = game_font.render(f'Score: {int(score)}', True, (255,255,255))
        score_rect = score_surface.get_rect(center = (250, 50))
        screen.blit(score_surface, score_rect)
    else:
        score_surface = game_font.render(f'Score: {int(score)}', True, (255,255,255))
        score_rect = score_surface.get_rect(center = (250, 50))
        screen.blit(score_surface, score_rect)

        high_score_surface = game_font.render(f'High Score: {int(high_score)}', True, (255,255,255))
        high_score_rect = high_score_surface.get_rect(center = (250, 100))
        screen.blit(high_score_surface, high_score_rect)

        play_again_surface = game_over_font.render('Press space to play!', True, (0,0,0))
        play_again_rect = play_again_surface.get_rect(center = (250, 300))
        screen.blit(play_again_surface, play_again_rect)

def update_score(score, high_score):
    if score > high_score:
        high_score = score
    return high_score


pygame.init()
screen = pygame.display.set_mode((500, 700))
clock = pygame.time.Clock()
game_font = pygame.font.Font('assets/BD_Cartoon_Shout.ttf',20)
game_over_font = pygame.font.Font('assets/BD_Cartoon_Shout.ttf',30)

#Game Variables
gravity = .25
pipe_distance = 1200
bird_movement = 0
game_active = False
score = 0
high_score = 0

#Background Surface
background_surface = pygame.image.load('assets/background.webp').convert()
background_surface = pygame.transform.scale_by(background_surface, (.75, .75))

#Floor Surface
floor_surface = pygame.image.load('assets/ground.jpg').convert()
floor_surface = pygame.transform.scale_by(floor_surface, (2, 2))
floor_x1 = 0
floor_x2 = 600

#Bird Surface
bird_surface = pygame.image.load('assets/bird.png').convert_alpha()
bird_surface = pygame.transform.scale_by(bird_surface, .25)
bird_down = pygame.image.load('assets/bird-down.png').convert_alpha()
bird_down = pygame.transform.scale_by(bird_down, .25)
bird_frames = [bird_surface, bird_down]
bird_rect = bird_surface.get_rect(center = (100,350))

#Pipe Surfaces
pipe_surface = pygame.image.load('assets/pipes-final.png').convert_alpha()
pipe_surface = pygame.transform.scale_by(pipe_surface, 2)
pipe_list = []
SPAWNPIPE = pygame.USEREVENT
pygame.time.set_timer(SPAWNPIPE, 1500)
pipe_height = [700, 800, 900]



#Main Game Loop ---------------------------------------------------------
while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()
        if event.type == pygame.KEYDOWN:
            #Pygame Key Binds
            if event.key == pygame.K_SPACE:
                bird_movement = 0
                bird_movement -= 6
            #Restart Game
            if event.key == pygame.K_SPACE and game_active == False:
                game_active = True
                pipe_list.clear()
                bird_rect.center = (100, 350)
                bird_movement = -6
                score = 0
        #Call function to spawn new set of pipes
        if event.type == SPAWNPIPE:
            pipe_list.extend(create_pipe(pipe_distance))

    #Display background
    screen.blit(background_surface, (0,0))

    if game_active:
        #Bird Movement
        bird_movement += gravity

        #Bird Animations
        if bird_movement > 0:
            bird_surface = bird_frames[0]
        else:
            bird_surface = bird_frames[1]
        rotated_bird = rotate_bird(bird_surface)
        bird_rect.centery += bird_movement
        screen.blit(rotated_bird,bird_rect)

        #Check For Collisions
        game_active = check_collision(pipe_list)

        #Pipes
        pipe_list = move_pipes(pipe_list)
        draw_pipes(pipe_list)
        score += .0056
        #Display only current score
        score_display(True)
    else:
        #Display high score
        high_score = update_score(score, high_score)
        score_display(False)
    #floor
    floor_x1 -= 2
    floor_x2 -= 2
    draw_floor()
    if floor_x1 <= -600:
        floor_x1 = 600
    if floor_x2 <= -600:
        floor_x2 = 600

    pygame.display.update()
    clock.tick(120)