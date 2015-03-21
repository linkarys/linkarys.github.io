require 'redcarpet'

# Simple converter that is probably better than RedCarpet's built in TOC id
# generator (which ends up with things lik id="toc_1"... terrible).

class Redcarpet::Render::HTML
  def header(title, level)
    clean_title = title
      .downcase
      .gsub(/\s+/, "-")
      .gsub(/[^A-Za-z0-9\-_.\u4e00-\u9fa5]/, "")

    return "<h#{level}><a class=\"hash-link\" href=\"##{clean_title}\">§</a> <a class=\"anchor\" name=\"#{clean_title}\"></a>#{title}</h#{level}>"
  end
end

