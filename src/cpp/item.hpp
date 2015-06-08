#ifndef LP_ITEM_HPP
#define LP_ITEM_HPP

#include <utility>

#include "boost/variant.hpp"

#include "empty_string.hpp"
#include "function.hpp"
#include "undefined.hpp"
#include "variable.hpp"

namespace lp {

class item
{
private:
    boost::variant<
        undefined,
        double,
        std::string,
        function,
        variable> m_value;
    
    struct type_visitor : public boost::static_visitor<std::string>
    {
        std::string operator()(undefined) const { return "undefined"; }
        std::string operator()(double) const { return "number"; }
        std::string operator()(const std::string&) const { return "string"; }
        std::string operator()(const function&) const { return "function"; }
        std::string operator()(const variable& v) const { return v->type(); }
    };

    struct number_visitor : public boost::static_visitor<double>
    {
        double operator()(double x) const { return x; }
        double operator()(const variable& v) const { return v->number(); }
        
        template <typename type>
        double operator()(const type&) const { assert(false); return 0.0; }
    };

    struct string_visitor : public boost::static_visitor<const std::string&>
    {
        const std::string& operator()(const std::string& s) const { return s; }
        const std::string& operator()(const variable& v) const { return v->string(); }
        
        template <typename type>
        std::string operator()(const type&) const { assert(false); return empty_string; }
    };

    struct function_visitor : public boost::static_visitor<const function&>
    {
        const function& operator()(const function& f) const { return f; }
        const function& operator()(const variable& v) const { return v->func(); }
        
        template <typename type>
        const function& operator()(const type&) const { assert(false); return empty_function; }
    };

public:
    item(double x) : m_value(x) { }
    item(const std::string& s) : m_value(s) { }
    item(const function& f) : m_value(f) { }
    item(const variable& v) : m_value(v) { }

    item& operator=(const item& item_b) { m_value = (item_b.is_variable() ? *boost::get<variable>(item_b.m_value) : item_b.m_value); }
    
    std::string type() const { return boost::apply_visitor(type_visitor(), m_value); }
    
    double number() const { return boost::apply_visitor(number_visitor(), m_value); }
    const std::string& string() const { return boost::apply_visitor(string_visitor(), m_value); }
    const function& func() const { boost::apply_visitor(function_visitor(), m_value); }
    
    bool is_variable() const { return boost::get<const variable*>(m_value) != nullptr; }
    void assign(const item& value) { boost::get<variable>(m_value).assign(value); }
};

} // namespace lp

#endif // LP_ITEM_HPP
