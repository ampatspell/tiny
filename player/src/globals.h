# pragma once

#include <Arduboy2.h>

extern Arduboy2 arduboy;

class NonAssignable {
private:
  NonAssignable(NonAssignable const&) = delete;
  NonAssignable& operator=(NonAssignable const&) = delete;
public:
  NonAssignable() {
  }
};

inline void * operator new (size_t size, void *ptr)
{
	return ptr;
}
