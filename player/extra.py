Import("env")

env.AlwaysBuild(env.Alias("emu", "$BUILD_DIR/${PROGNAME}.hex", ["sim_arduboy -p 4 $SOURCE"]))
