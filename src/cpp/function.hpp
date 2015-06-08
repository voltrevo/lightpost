#ifndef LP_FUNCTION_HPP
#define LP_FUNCTION_HPP

#include <functional>

namespace lp {

class frame;

using function = std::function<void (frame&)>;
extern const function empty_function;

} // namespace lp

#endif // LP_FUNCTION_HPP
